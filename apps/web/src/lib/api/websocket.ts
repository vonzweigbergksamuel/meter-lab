import type { SocketRouterClient } from "@meter-lab/orpc";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/websocket";
import { browser } from "$app/environment";
import { PUBLIC_BACKEND_URL } from "$env/static/public";

let wsClient: SocketRouterClient | undefined;

if (browser) {
	console.log("WS url: ", PUBLIC_BACKEND_URL);

	const WS_URL = PUBLIC_BACKEND_URL.replace('http', "ws")

	const websocket = new WebSocket(WS_URL);

	// TODO Remove
	websocket.addEventListener("open", () => {
		console.log("WS OPEN ✅", websocket.readyState); // 1
	});

	websocket.addEventListener("error", (err) => {
		console.error("WS ERROR ❌", err);
	});

	websocket.addEventListener("close", () => {
		console.log("WS CLOSED ⛔");
	});

	const link = new RPCLink({ websocket });

	// Type assertion to satisfy the expected type for wsClient
	wsClient = createORPCClient(link) as SocketRouterClient;
}

export { wsClient };
