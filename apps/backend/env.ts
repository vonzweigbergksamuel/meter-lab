import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	server: {
		// NODE
		NODE_ENV: z
			.enum(["development", "production", "test", "stage"])
			.default("development"),

		// SERVER
		PORT: z.coerce.number(),

		// AUTH
		AUTH_SERVICE_URL: z.string(),

		// DB
		DATABASE_HOST: z.string(),
		DATABASE_PORT: z.coerce.number(),
		DATABASE_USER: z.string(),
		DATABASE_PASSWORD: z.string(),
		DATABASE_NAME: z.string(),

		// EMQX
		EMQX_URL: z.string(),
		EMQX_TOPIC: z.string(),
		EMQX_USERNAME: z.string(),
		EMQX_PASSWORD: z.string(),

		// REDIS
		REDIS_URL: z.string(),

		// Backend
		BACKEND_URL: z.string(),

		// Rabbit
		RABBIT_URL: z.string(),
		RABBIT_QUEUE: z.string(),

		// Test runner
		TEST_RUNNER_USERNAME: z.string(),
		TEST_RUNNER_PASSWORD: z.string(),
	},

	/**
	 * The prefix that client-side variables must have. This is enforced both at
	 * a type-level and at runtime.
	 */
	clientPrefix: "PUBLIC_",
	client: {},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
});
