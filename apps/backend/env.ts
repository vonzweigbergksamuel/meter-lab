import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	server: {
		NODE_ENV: z
			.enum(["development", "production", "testing"])
			.default("development"),
		PORT: z.coerce.number(),
		EMQX_URL: z.string(),
		EMQX_TOPIC: z.string(),
		EMQX_USERNAME: z.string(),
		EMQX_PASSWORD: z.string(),
		REDIS_URL: z.string(),
		WEBSOCKET_PORT: z.coerce.string(),
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
