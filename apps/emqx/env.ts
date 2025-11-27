import { z } from "zod";

const envSchema = z.object({
	BROKER_URL: z.string(),
	TOPIC: z.string(),
	NUM_DEVICE: z.coerce.number(),
});

const env = envSchema.parse(process.env);

export { env };
