import { serve } from "@hono/node-server";
import { Hono } from "hono";
import type { WebSocket } from "ws";
import { getKeyValueStoreService, getMqttService } from "../di/helpers.js";
import { injectDependencies } from "../di/setup.js";
import { env } from "../env.js";
import { openApiHandler, rpcHandler, wsHandler } from "../utils/orpc.js";
import { wss } from "../utils/websocket.js";

// Create DI container
injectDependencies();

// Connect to KeyValueStore instance (Redis)
await getKeyValueStoreService().connect();

// Connect to Broker instance (EMQX/MQTT), non-blocking
getMqttService()
	.connect()
	.catch((err) => {
		console.error("Failed to connect to MQTT broker:", err.message);
	});

// Create HTTP app
const app = new Hono();

app.get("/", (c) => {
	return c.text("Hello Hono!");
});

/* --------- RPC Handler --------- */
app.use("/rpc/*", async (c, next) => {
	const { matched, response } = await rpcHandler.handle(c.req.raw, {
		prefix: "/rpc",
		context: {
			request: c.req.raw,
		},
	});

	if (matched) {
		return c.newResponse(response.body, response);
	}

	await next();
});

/* --------- OpenAPI Handler --------- */
app.use("/api/*", async (c, next) => {
	const { matched, response } = await openApiHandler.handle(c.req.raw, {
		prefix: "/api",
		context: {
			request: c.req.raw,
		},
	});

	if (matched) {
		return c.newResponse(response.body, response);
	}

	await next();
});

/* --------- WebSocket Handler --------- */
wss.on("connection", (ws: WebSocket) => {
	wsHandler.upgrade(ws, {
		context: {
			request: new Request("ws://localhost"),
		},
	});
});

wss.on("listening", () => {
	console.log(
		`WebSocket server listening on ws://localhost:${env.WEBSOCKET_PORT}`,
	);
});

/* --------- Start HTTP Server --------- */
serve(
	{
		fetch: app.fetch,
		port: env.PORT,
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`);
	},
);
