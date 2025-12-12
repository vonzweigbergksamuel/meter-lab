import { os } from "@orpc/server";
import * as z from "zod";
import { getTestController } from "../../di/helpers.js";

// import { protectedProcedure } from "../index.js";

/** ------------------ Output Schemas ------------------ */
const testsOutputSChema = z.object({
	message: z.string(),
});

/** ------------------ Input Schemas ------------------ */

export const testsRouter = {
	tests: os //protectedProcedure // TODO change to protected later
		.route({ method: "GET" })
		.input(z.object({ limit: z.number().optional() })) // We will need to filter on somethings
		.output(testsOutputSChema)
		.handler(() => {
			return getTestController().getAllTests();
		}),
	findTests: os //protectedProcedure // TODO change to protected later
		.route({ method: "GET" })
		.input(z.object({ id: z.string() })) // Id
		.output(testsOutputSChema)
		.handler(() => {
			return getTestController().getTest()
		}),
	createTests: os //protectedProcedure // TODO change to protected later
		.route({ method: "POST" })
		.input(z.object({ id: z.string() })) // Test object
		.output(testsOutputSChema)
		.handler(() => {
			return getTestController().createTest();
		}),
	deleteTests: os //protectedProcedure // TODO change to protected later
		.route({ method: "DELETE" })
		.input(z.object({ id: z.string().min(1) })) // Id
		.output(testsOutputSChema)
		.handler(() => {
			return getTestController().deleteTest();
		}),
};
