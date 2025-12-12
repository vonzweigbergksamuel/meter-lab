import type { TestDB } from "../../core/services/database/interface.js";
import type { TestInput } from "../../core/services/database/types.js";

export class TestsController {
	#service: TestDB;

	constructor(service: TestDB) {
		this.#service = service;
	}

	async getAllTests() {
		// Find all tests
		// with filter or search
		return await this.#service.findAll();

	}

	async getTest(id: number) {
		// find test with id
		return await this.#service.findById(id);
	}

	async createTest(data: TestInput) {
		// Route validates input
		// Validate connected devices exist in redis
		// Append the test to the queue
		// Append two callback urls

		await this.#service.create(data);;
	}

	async deleteTest(id: number) {
		await this.#service.delete(id);
	}
}
