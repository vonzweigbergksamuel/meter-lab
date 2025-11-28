import { createClient } from "redis";
import { env } from "../env.js";

const REDIS_URL = env.REDIS_URL;
type Client = ReturnType<typeof createClient>;

let redis: Client;

export async function connectToRedis(): Promise<void> {
	console.log("Connecting to redis...");
	redis = createClient({ url: REDIS_URL });

	redis.on("error", (error) => {
		console.error("Redis client error:", error);
	});

	await redis.connect();
	console.log("Connected to redis");
}

export function getRedis(): Client {
	if (!redis)
		throw new Error("Redis not connected. Call connectToRedis() first.");
	return redis;
}
