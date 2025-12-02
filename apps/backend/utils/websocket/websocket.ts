import { WebSocket } from "ws";
import { wss } from "./websocketserver.js";

// Send data to all connected clients
export function sendDataWSS(payload: unknown) {
	const data = JSON.stringify(payload);

	wss.clients.forEach((client: WebSocket) => {
		if (client.readyState === WebSocket.OPEN) {
			console.log("Data send to Client! ", data);
			client.send(data);
		}
	});
}
