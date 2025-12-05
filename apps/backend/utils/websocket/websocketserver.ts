import { WebSocketServer } from "ws";
import { env } from "../../env.js";
import { wsRpcHandler } from "../worpc.js";

/* -------- VARIABLES -------- */
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
