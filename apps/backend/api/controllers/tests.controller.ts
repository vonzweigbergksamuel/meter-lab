import { randomUUID } from "node:crypto";
import { ORPCError } from "@orpc/client";
import type { TestDB } from "../../core/services/database/interface.js";
import type { Filter, TestInput } from "../../core/services/database/types.js";
import type { KeyValueStoreService } from "../../core/services/key-value-store/interface.js";
import type { IQueue } from "../../core/services/queue/interface.js";
import { env } from "../../env.js";

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
		// Validate connected devices exist in redis
		const devices = data.devices;

		await this.#deviceAvailability(devices);

		const testData = await this.#dBservice.create(data);

		await this.#updateDeviceStatus(devices, "unavailable");
		// Append the test to the queue

		const token = randomUUID();

		this.#keyValueService.set(token, "pending");

		const testObj = {
			testData,
			callback: {
				testStart: `${env.BACKEND_URL}/tests/testStart?id=${testData.id}`,
				testEnd: `${env.BACKEND_URL}/tests/testResult?id=${testData.id}`,
				token,
			},
		};

		// Append the test to the queue
		this.#queueService.addToQueue(testObj);

		// Update Websocket


		return { testId: testData.id };
	}

	// Check if all devices in availble
	async #deviceAvailability(devices: string[]) {
		for (const deviceId of devices) {
			const device = await this.#keyValueService.get(deviceId);

			if (!device) {
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
	}

	async testStart(id: number, token: string) {
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

		this.#keyValueService.set(token, "running");

		// Update Websocket
		// this.#sendToQueue(id);
	}

	async testResult(id: number, status: "completed" | "failed", token: string) {
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

		this.#keyValueService.delete(token);

		// Update Websocket
		await this.#sendToWebsocket(id);
	}

	async #sendToWebsocket(id: number) {
		const result = await this.#dBservice.findById(id)
		// this.#queueService.addToQueue(result);
	}
}
