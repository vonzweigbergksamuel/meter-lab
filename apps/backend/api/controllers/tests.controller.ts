import { ORPCError } from "@orpc/client";
import type { TestDB } from "../../core/services/database/interface.js";
import type { Filter, TestInput } from "../../core/services/database/types.js";
import type { KeyValueStoreService } from "../../core/services/key-value-store/interface.js";
import type { IQueue } from "../../core/services/queue/interface.js";
import { env } from "../../env.js";
import { WS_CHANNELS } from "../../lib/websocket/channels.js";
import { publish } from "../../lib/websocket/websocket.js";

export class TestsController {
	#dBservice: TestDB;
	#keyValueService: KeyValueStoreService;
	#queueService;

	constructor(
		service: TestDB,
		keyValueService: KeyValueStoreService,
		queueService: IQueue,
	) {
		this.#dBservice = service;
		this.#keyValueService = keyValueService;
		this.#queueService = queueService;
	}

	async getAllTests(filter?: Filter) {
		return await this.#dBservice.findAll(filter);
	}

	async getTest(id: number) {
		return await this.#dBservice.findById(id);
	}

	async deleteTest(id: number) {
		await this.#dBservice.delete(id);
	}

	async createTest(data: TestInput) {
		const devices = data.devices;

		await this.#deviceAvailability(devices);

		const testData = await this.#dBservice.create(data);

		await this.#updateDeviceStatus(devices, "unavailable");

		const testObj = {
			testData,
			callback: {
				testStart: `${env.BACKEND_URL}/api/tests/testStart`,
				testEnd: `${env.BACKEND_URL}/api/tests/testResult`,
			},
		};

		// Append the test to the queue
		this.#queueService.addToQueue(testObj);

		// Update Websocket
		await this.#sendToWebsocketTest(testData.id);

		return { testId: testData.id };
	}

	// Check if all devices in availble
	async #deviceAvailability(devices: string[]) {
		for (const deviceId of devices) {
			const device = await this.#keyValueService.get(deviceId);

			if (!device || device !== "available") {
				throw new ORPCError("BAD_REQUEST");
			}
		}
	}

	async #updateDeviceStatus(
		devices: string[],
		status: "unavailable" | "available",
	) {
		for (const deviceId of devices) {
			await this.#keyValueService.set(deviceId, status);
		}

		// send all devices that is under test
		this.#sendToWebsocketDevice();
	}

	async testStart(id: number) {
		// Check if test already started
		const testCase = await this.#dBservice.findById(id);
		if (testCase.startAt) {
			throw new ORPCError("BAD_REQUEST");
		}

		// Update DB
		const data = {
			startAt: new Date(),
			status: "running" as const,
		};

		await this.#dBservice.update(id, data);

		// Update Websocket
		await this.#sendToWebsocketTest(id);
	}

	async testResult(id: number, status: "completed" | "failed") {
		// Check if test already ended
		const testCase = await this.#dBservice.findById(id);
		if (testCase.endAt) {
			throw new ORPCError("BAD_REQUEST");
		}

		const data = {
			endAt: new Date(),
			status,
		};

		await this.#dBservice.update(id, data);

		this.#updateDeviceStatus(testCase.devices, "available");

		// Update Websocket
		await this.#sendToWebsocketTest(id);
	}

	async #sendToWebsocketTest(id: number) {
		const result = await this.#dBservice.findById(id);
		publish(WS_CHANNELS.TEST_UPDATE, result);
	}

	async #sendToWebsocketDevice() {
		// Get all in values in redis and send that instead
		const devices = await this.#keyValueService.getAll();
		publish(WS_CHANNELS.DEVICE_UPDATE, { devices });
	}
}
