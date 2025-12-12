import { os } from "@orpc/server";
import * as z from "zod";
import { testDataZodSchema } from "../../db/schema/schema.js";
import { getTestController } from "../../di/helpers.js";

// import { protectedProcedure } from "../index.js";

/** ------------------ Input Schemas ------------------ */
export const filterInputSchema = z.object({
	limit: z.coerce.number().optional(),
	endAt: z.coerce.date().optional(),
	testType: z.literal("alive").optional(),
});

export const testInputSchema = z.object({
	title: z.string(),
	description: z.string(),
	testType: z.literal("alive"),
	devices: z.array(z.string()),
});

export const testsRouter = {
	tests: os //protectedProcedure // TODO change to protected later
		.route({ method: "GET" })
		.input(filterInputSchema)
		.output(z.array(testDataZodSchema))
		.handler((opts) => {
			return getTestController().getAllTests(opts.input);
		}),
	findTests: os //protectedProcedure // TODO change to protected later
		.route({ method: "GET" })
		.input(z.object({ id: z.coerce.number() })) // Id
		.output(testDataZodSchema)
		.handler((opts) => {
			const { id } = opts.input;
			return getTestController().getTest(id);
		}),
	createTests: os //protectedProcedure // TODO change to protected later
		.route({ method: "POST" })
		.input(testInputSchema)
		.handler((opts) => {
			const input = opts.input;
			// Provide default values for missing fields required by the controller
			return getTestController().createTest(input);
		}),
	deleteTests: os //protectedProcedure // TODO change to protected later
		.route({ method: "DELETE" })
		.input(z.object({ id: z.coerce.number() })) // Id
		.handler((opts) => {
			const { id } = opts.input;
			return getTestController().deleteTest(id);
		}),
};
