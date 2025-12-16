import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { WebSocketServer } from "ws";
import {
	getKeyValueStoreService,
	getMqttService,
	getRabbitService,
} from "../di/helpers.js";
import { injectDependencies } from "../di/setup.js";
import { env } from "../env.js";
import { openApiHandler, rpcHandler } from "../lib/utils/orpc.js";
import { wsRpcHandler } from "../lib/utils/worpc.js";

// Create DI container
injectDependencies();

// Connect to KeyValueStore instance (Redis)
await getKeyValueStoreService().connect();

// Connect to Broker instance (EMQX/MQTT), non-blocking
await getMqttService().connect();
getMqttService().listen();

// Connect to Queue (Rabbit)
await getRabbitService().connect();

// Create HTTP app
const app = new Hono();

app.get("/", (c) => {
	return c.text("Hello Hono!");
});

// Only neccessary on stage
let BASE_PATH = '';
const isStage = env.AUTH_SERVICE_URL.includes("34.51");
if (isStage) {
	BASE_PATH = "/backend";
}

/* --------- RPC Handler --------- */
app.use(`${BASE_PATH}/rpc/*`, async (c, next) => {
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
app.use(`${BASE_PATH}/api/*`, async (c, next) => {
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

/* --------- Start HTTP Server --------- */
const server = serve(
	{
		fetch: app.fetch,
		port: env.PORT,
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`);
	},
);

/* --------- Attach WebSocket Server to HTTP Server --------- */
export const wss = new WebSocketServer({ noServer: true });

server.on("upgrade", (request, socket, head) => {
	wss.handleUpgrade(request, socket, head, (ws) => {
		wsRpcHandler.upgrade(ws, {
			context: {
				request,
			},
		});
	});
});

console.log(`WebSocket server attached to http://localhost:${env.PORT}`);
