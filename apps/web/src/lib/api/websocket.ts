import type { SocketRouterClient } from "@meter-lab/orpc";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/websocket";
import { browser } from "$app/environment";
import { PUBLIC_BACKEND_URL } from "$env/static/public";

export function createWebSocketClient(): SocketRouterClient | undefined {
	if (!browser) {
		return undefined;
	}

	const WS_URL = PUBLIC_BACKEND_URL.replace("http", "ws");

	console.log("WS url: ", WS_URL);

	const websocket = new WebSocket(WS_URL);

	websocket.addEventListener("open", () => {
		console.log("WS OPEN ✅", websocket.readyState);
	});

	websocket.addEventListener("error", (err) => {
		console.error("WS ERROR ❌", err);
	});

	websocket.addEventListener("close", () => {
		console.log("WS CLOSED ⛔");
	});

	const link = new RPCLink({ websocket });

	return createORPCClient(link) as SocketRouterClient;
}
