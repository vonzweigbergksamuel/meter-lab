import { os } from "@orpc/server";
import * as z from "zod";
import { testDataZodSchema } from "../../db/schema/schema.js";
import { getTestController } from "../../di/helpers.js";
import { tokenProtectedProcedure } from "../index.js";

// import { protectedProcedure } from "../index.js";

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
	allTests: os //protectedProcedure // TODO change to protected later
		.route({ method: "GET" })
		.input(filterInputSchema)
		.output(z.array(testDataZodSchema))
		.handler(async (opts) => {
			return await getTestController().getAllTests(opts.input);
		}),
	findTests: os //protectedProcedure // TODO change to protected later
		.route({ method: "GET" })
		.input(z.object({ id: z.coerce.number() })) // Id
		.output(testDataZodSchema)
		.handler(async (opts) => {
			const { id } = opts.input;
			return await getTestController().getTest(id);
		}),
	createTests: os //protectedProcedure // TODO change to protected later
		.route({ method: "POST" })
		.input(testInputSchema)
		.output(z.object({ testId: z.string() }))
		.handler(async (opts) => {
			const input = opts.input;
			const { testId } = await getTestController().createTest(input);
			return { testId: String(testId) };
		}),
	deleteTests: os //protectedProcedure // TODO change to protected later
		.route({ method: "DELETE" })
		.input(z.object({ id: z.coerce.number() })) // Id
		.handler(async (opts) => {
			const { id } = opts.input;
			return await getTestController().deleteTest(id);
		}),
	testStart: tokenProtectedProcedure //tokenProtectedProcedure // TODO change to tokenProtectedProcedure later
		.route({ method: "POST" })
		.input(z.object({ id: z.coerce.number() }))
		.handler(async (opts) => {
			console.log("METHOD:", opts.context.request.method);
			console.log(
				"CONTENT-TYPE:",
				opts.context.request.headers.get("content-type"),
			);
			console.log("RAW BODY:", await opts.context.request.clone().text());
			console.log("INPUT:", opts.input);
			const { id } = opts.input;
			const { token } = opts.context;

			console.log(id, token);

			return await getTestController().testStart(id, token);
		}),
	testResult: tokenProtectedProcedure //tokenProtectedProcedure // TODO change to tokenProtectedProcedure later
		.route({ method: "POST" })
		.input(
			z.object({
				id: z.coerce.number(),
				status: z.union([z.literal("completed"), z.literal("failed")]),
			}),
		)
		.handler(async (opts) => {
			const { id, status } = opts.input;
			const { token } = opts.context;

			return await getTestController().testResult(id, status, token);
		}),
};
