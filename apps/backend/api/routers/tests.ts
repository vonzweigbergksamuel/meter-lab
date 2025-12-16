import * as z from "zod";
import { getTestController } from "../../di/helpers.js";
import { testDataSchemaZod } from "../../lib/db/schema/schema.js";
import { basicAuthProcedure, protectedProcedure } from "../index.js";

/** ------------------ Input Schemas ------------------ */
export const filterInputSchema = z.object({
	limit: z.coerce.number().optional(),
	endAt: z.coerce.date().optional(),
	testType: z.enum(["alive", "stress"]).optional(),
});

export const testInputSchema = z.object({
	title: z.string().trim().min(1),
	description: z.string().trim().min(1),
	testType: z.enum(["alive", "stress"]),
	devices: z.array(z.string().trim().min(1)),
});

export const testsRouter = {
	allTests: protectedProcedure
		.route({ method: "GET" })
		.input(filterInputSchema)
		.output(z.array(testDataSchemaZod))
		.handler(async ({ input }) => {
			return await getTestController().getAllTests(input);
		}),
	findTests: protectedProcedure
		.route({ method: "GET" })
		.input(z.object({ id: z.coerce.number() })) // Id
		.output(testDataSchemaZod)
		.handler(async ({ input: { id } }) => {
			return await getTestController().getTest(id);
		}),
	createTests: protectedProcedure
		.route({ method: "POST" })
		.input(testInputSchema)
		.output(
			z.object({
				success: z.boolean(),
				testId: z.string(),
			}),
		)
		.handler(async ({ input }) => {
			console.log("input", input);
			const { testId } = await getTestController().createTest(input);
			console.log("testId", testId);
			return {
				success: true,
				testId: String(testId),
			};
		}),
	deleteTests: protectedProcedure
		.route({ method: "DELETE" })
		.input(z.object({ id: z.coerce.number() }))
		.handler(async ({ input: { id } }) => {
			await getTestController().deleteTest(id);
		}),
	testStart: basicAuthProcedure
		.route({ method: "POST" })
		.input(z.object({ id: z.coerce.number() }))
		.handler(async ({ input: { id } }) => {
			await getTestController().testStart(id);
		}),
	testResult: basicAuthProcedure
		.route({ method: "POST" })
		.input(
			z.object({
				id: z.coerce.number(),
				status: z.union([z.literal("completed"), z.literal("failed")]),
			}),
		)
		.handler(async ({ input: { id, status } }) => {
			await getTestController().testResult(id, status);
		}),
};
