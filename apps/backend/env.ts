import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	server: {
		// NODE
		NODE_ENV: z
			.enum(["development", "production", "testing"])
			.default("development"),

		// SERVER
		PORT: z.coerce.number(),

		// DB
		DATABASE_URL: z.string(),

		// EMQX
		EMQX_URL: z.string(),
		EMQX_TOPIC: z.string(),
		EMQX_USERNAME: z.string(),
		EMQX_PASSWORD: z.string(),

		// REDIS
		REDIS_URL: z.string(),

		// WS
		WEBSOCKET_PORT: z.coerce.number(),
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
