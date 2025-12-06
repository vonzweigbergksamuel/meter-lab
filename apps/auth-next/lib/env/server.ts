import { createEnv } from "@t3-oss/env-nextjs";
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
		DATABASE_HOST: z.string(),
		DATABASE_PORT: z.coerce.number(),
		DATABASE_USER: z.string(),
		DATABASE_PASSWORD: z.string(),
		DATABASE_NAME: z.string(),

		// AUTH
		BETTER_AUTH_SECRET: z.string(),
		BETTER_AUTH_URL: z.string(),
	},
	experimental__runtimeEnv: process.env,
});
