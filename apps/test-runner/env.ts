import { z } from "zod";

const envSchema = z.object({
	RABBIT_URL: z.string()
});

const env = envSchema.parse(process.env);

export { env };
