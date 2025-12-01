import { WebSocket } from "ws";
import { wss } from "./websocketserver.js";

export function sendDataWSS(payload: unknown) {
	const data = JSON.stringify(payload);

	wss.clients.forEach((client: WebSocket) => {
		if (client.readyState === WebSocket.OPEN) {
      console.log('Data send to Client! ', data)
			client.send(data);
		}
	});
}
