import { ORPCError } from "@orpc/client";
import type { TestDB } from "../../core/services/database/interface.js";
import type { Filter, TestInput } from "../../core/services/database/types.js";
import type { KeyValueStoreService } from "../../core/services/key-value-store/interface.js";

export class TestsController {
		#dBservice: TestDB;
		#keyValueService: KeyValueStoreService;

		constructor(service: TestDB, keyValueService: KeyValueStoreService) {
			this.#dBservice = service;
			this.#keyValueService = keyValueService
		}

		async getAllTests(filter?: Filter) {
			return await this.#dBservice.findAll(filter);
		}

		async getTest(id: number) {
			return await this.#dBservice.findById(id);
		}

		async createTest(data: TestInput) {
			// Validate connected devices exist in redis
			const devices = data.devices;

			for (const deviceId in devices) {
				const device = this.#keyValueService.get(deviceId);

				if (!device) {
					throw new ORPCError("BAD_REQUEST")
				}
			}

			await this.#dBservice.create(data);

			// Append the test to the queue
			// Append two callback urls
		}

		async deleteTest(id: number) {
			await this.#dBservice.delete(id);
		}
	}
