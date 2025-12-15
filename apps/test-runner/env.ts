import { z } from "zod";

const envSchema = z.object({
	RABBIT_URL: z.string(),
	RABBIT_QUEUE: z.string(),
	TEST_RUNNER_USERNAME: z.string(),
	TEST_RUNNER_PASSWORD: z.string()
});

const env = envSchema.parse(process.env);

export { env };
