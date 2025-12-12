export class TestsController {
	async getAllTests() {
		return { message: "Hello From TestController, GET /tests route" };
	}

	async getTest() {
		return { message: "Hello From TestController, GET /tests/:id route" };
	}

	async createTest() {
		return { message: "Hello From TestController, POST /tests route" };
	}

	async deleteTest() {
		return { message: "Hello From TestController, DELETE /tests route" };
	}
}
