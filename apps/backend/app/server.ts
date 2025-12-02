import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { getKeyValueStoreService, getMqttService } from "../di/helpers.js";
import { injectDependencies } from "../di/setup.js";
import { env } from "../env.js";
import { openApiHandler, rpcHandler } from "../utils/orpc.js";

// Create WebSocketServer
import "../utils/websocket/websocketserver.js";

// Create DI container
injectDependencies();

// Connect to KeyValueStore instance (Redis)
await getKeyValueStoreService().connect();

// Connect to Broker instance (EMQX/MQTT)
await getMqttService().connect();
getMqttService().listen();

// Create HTTP app
const app = new Hono();

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
