import { ORPCError } from "@orpc/client";
import type { TestDB } from "../../core/services/database/interface.js";
import type { Filter, TestInput } from "../../core/services/database/types.js";
import type { KeyValueStoreService } from "../../core/services/key-value-store/interface.js";
import { env } from "../../env.js";

export class TestsController {
	#dBservice: TestDB;
	#keyValueService: KeyValueStoreService;

	constructor(service: TestDB, keyValueService: KeyValueStoreService) {
		this.#dBservice = service;
		this.#keyValueService = keyValueService;
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

		await this.#updateDeviceStatus(devices);
		// Append the test to the queue

		// How should we do this?
		// In some way we need to validate the request. we will not have a token otherwise we send one with the request. Which probably is the best way to do this.
		// Maybe some validate to see if the testData already have been started?
		const testObj = {
			testData,
			callback: {
				testStart: `${env.BACKEND_URL}/tests/testStart?id=${testData.id}`,
				testEnd: `${env.BACKEND_URL}/tests/testResult?id=${testData.id}`,
				token: "placeholder", // TODO
			},
		};

		// Append the test to the queue
		console.log(testObj);

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

	async #updateDeviceStatus(devices: string[]) {
		for (const deviceId of devices) {
			await this.#keyValueService.set(deviceId, "unavailable");
		}
	}

	async testStart(id: number) {
		// Update DB
		const data = {
			startAt: new Date(),
			status: "running" as const,
		};
		this.#dBservice.update(id, data);
	}

	async testResult(id: number, status: "completed" | "failed") {
		const data = {
			endAt: new Date(),
			status,
		};

		this.#dBservice.update(id, data);
	}
}
