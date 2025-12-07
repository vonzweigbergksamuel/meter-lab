import * as z from "zod";
import { protectedProcedure } from "../index.js";

const resultsOutputSchema = z.object({
	tests: z
		.object({
			title: z.string(),
		})
		.array(),
});

export const resultsRouter = {
	results: protectedProcedure
		.route({ method: "GET" })
		.input(z.object({ limit: z.number().optional() }))
		.output(resultsOutputSchema)
		.handler(({ input }) => {
			const results = {
				tests: [{ title: "Test1" }, { title: "Test2" }],
			};

			return results;
		}),
};
