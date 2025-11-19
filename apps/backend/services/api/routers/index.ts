import type { RouterClient } from "@orpc/server";
import { publicProcedure } from "../index.js";
import { resultsRouter } from "./results.js";

export const appRouter = {
	healthCheck: publicProcedure.route({ method: "GET" }).handler(() => {
		return "OK";
	}),
	...resultsRouter,
};

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
