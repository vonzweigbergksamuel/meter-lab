import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { WebSocketServer } from "ws";
import { getKeyValueStoreService, getMqttService } from "../di/helpers.js";
import { injectDependencies } from "../di/setup.js";
import { env } from "../env.js";
import { openApiHandler, rpcHandler } from "../utils/orpc.js";
import { wsRpcHandler } from "../utils/worpc.js";

// Create DI container
injectDependencies();

// Connect to KeyValueStore instance (Redis)
await getKeyValueStoreService().connect();

// Connect to Broker instance (EMQX/MQTT), non-blocking
await getMqttService().connect();
getMqttService().listen();

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

/* --------- Start Websocket Server --------- */
const WS_PORT = Number(env.WEBSOCKET_PORT);

export const wss = new WebSocketServer({ port: WS_PORT });

wss.on("connection", (ws) => {
	wsRpcHandler.upgrade(ws, {
		context: {},
	});
});

wss.on("listening", () => {
	console.log(`WebSocket server listening on ws://localhost:${WS_PORT}`);
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
