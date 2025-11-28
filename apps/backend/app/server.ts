import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { connectToMqtt, listenForDevice } from "../config/mqtt.js";
import { connectToRedis } from "../config/redis.js";
import { env } from "../env.js";
import { openApiHandler, rpcHandler } from "../utils/orpc.js";

const app = new Hono();

// Connect to broker
const client = await connectToMqtt();
listenForDevice(client);

// Connect to redis
await connectToRedis();

app.get("/", (c) => {
	return c.text("Hello Hono!");
});

// RPC handler
app.use("/rpc/*", async (c, next) => {
	const { matched, response } = await rpcHandler.handle(c.req.raw, {
		prefix: "/rpc",
		context: {},
	});

	if (matched) {
		return c.newResponse(response.body, response);
	}

	await next();
});

// OpenAPI handler
app.use("/api/*", async (c, next) => {
	const { matched, response } = await openApiHandler.handle(c.req.raw, {
		prefix: "/api",
		context: {},
	});

	if (matched) {
		return c.newResponse(response.body, response);
	}

	await next();
});

serve(
	{
		fetch: app.fetch,
		port: env.PORT,
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`);
	},
);
