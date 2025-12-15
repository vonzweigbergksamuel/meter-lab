import * as z from "zod";
import { testDataZodSchema } from "../../db/schema/schema.js";
import { getTestController } from "../../di/helpers.js";
import { basicAuthProcedure, protectedProcedure } from "../index.js";

/** ------------------ Input Schemas ------------------ */
export const filterInputSchema = z.object({
	limit: z.coerce.number().optional(),
	endAt: z.coerce.date().optional(),
	testType: z.literal("alive").optional(),
});

export const testInputSchema = z.object({
	title: z.string().trim().min(1),
	description: z.string().trim().min(1),
	testType: z.literal("alive"),
	devices: z.array(z.string().trim().min(1)),
});

export const testsRouter = {
	allTests: protectedProcedure
		.route({ method: "GET" })
		.input(filterInputSchema)
		.output(z.array(testDataZodSchema))
		.handler(async (opts) => {
			return await getTestController().getAllTests(opts.input);
		}),
	findTests: protectedProcedure
		.route({ method: "GET" })
		.input(z.object({ id: z.coerce.number() })) // Id
		.output(testDataZodSchema)
		.handler(async (opts) => {
			const { id } = opts.input;
			return await getTestController().getTest(id);
		}),
	createTests: protectedProcedure
		.route({ method: "POST" })
		.input(testInputSchema)
		.output(z.object({ testId: z.string() }))
		.handler(async ({ input }) => {
			const { testId } = await getTestController().createTest(input);
			return { testId: String(testId) };
		}),
	deleteTests: protectedProcedure
		.route({ method: "DELETE" })
		.input(z.object({ id: z.coerce.number() }))
		.handler(async ({ input }) => {
			return await getTestController().deleteTest(input.id);
		}),
	testStart: basicAuthProcedure
		.route({ method: "POST" })
		.input(z.object({ id: z.coerce.number() }))
		.handler(async ({ input }) => {
			return await getTestController().testStart(input.id);
		}),
	testResult: basicAuthProcedure
		.route({ method: "POST" })
		.input(
			z.object({
				id: z.coerce.number(),
				status: z.union([z.literal("completed"), z.literal("failed")]),
			}),
		)
		.handler(async ({ input }) => {
			return await getTestController().testResult(input.id, input.status);
		}),
};
