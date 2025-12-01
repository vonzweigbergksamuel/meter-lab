import { WebSocketServer } from "ws";
import { env } from "../env.js";
import { wsRpcHandler } from "./orpc.js";

/* -------- VARIABLES -------- */
const WS_PORT = Number(env.WEBSOCKET_PORT);
let SOCKET: WebSocketServer;

export function createWebsocketServer() {
	SOCKET = new WebSocketServer({ port: WS_PORT });

	SOCKET.on("connection", (ws) => {
		wsRpcHandler.upgrade(ws, {
			context: {},
		});
	});
}

export function getWSS() {
	if (!SOCKET) {
		throw new Error("Websocket not started.");
	}

	return SOCKET;
}
