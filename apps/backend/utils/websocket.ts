import { WebSocketServer } from "ws";
import { env } from "../env.js";

export const wss = new WebSocketServer({ port: env.WEBSOCKET_PORT });

export function broadcast(data: unknown) {
	const message = JSON.stringify(data);

	for (const client of wss.clients) {
		if (client.readyState === WebSocket.OPEN) {
			client.send(message);
		}
	}
}
