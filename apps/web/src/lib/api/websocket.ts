import type { SocketRouterClient } from "@meter-lab/orpc";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/websocket";
import { browser } from "$app/environment";
import { PUBLIC_BACKEND_URL, PUBLIC_IS_LOCAL } from "$env/static/public";

function getJwtFromCookie(): string | null {
	if (!browser) return null;
	const cookies = document.cookie.split(";");
	for (const cookie of cookies) {
		const [name, value] = cookie.trim().split("=");
		if (name === "jwt-client") {
			return value;
		}
	}
	return null;
}

function getWebSocketUrl(): string {
	const isLocalUrl = PUBLIC_BACKEND_URL.includes("localhost");
	const isStagingUrl = PUBLIC_BACKEND_URL.includes("nordicode");

	let backendUrl: string;
	if ((isLocalUrl && PUBLIC_IS_LOCAL === "true") || browser) {
		backendUrl = PUBLIC_BACKEND_URL;
	} else if (isLocalUrl) {
		backendUrl = PUBLIC_BACKEND_URL.replace("localhost", "backend");
	} else if (isStagingUrl) {
		backendUrl = "http://backend:80";
	} else {
		backendUrl = "http://backend:5070";
	}

	let wsUrl = backendUrl.replace(/^http/, "ws");
	
	const jwt = getJwtFromCookie();
	if (jwt) {
		const url = new URL(wsUrl);
		url.searchParams.set("token", jwt);
		wsUrl = url.toString();
	}

	return wsUrl;
}

function getJwtFromCookie(): string | null {
	if (!browser) return null;
	const cookies = document.cookie.split(";");
	for (const cookie of cookies) {
		const [name, value] = cookie.trim().split("=");
		if (name === "jwt-client") {
			return value;
		}
	}
	return null;
}

function getWebSocketUrl(): string {
	const isLocalUrl = PUBLIC_BACKEND_URL.includes("localhost");
	const isStagingUrl = PUBLIC_BACKEND_URL.includes("nordicode");

	let backendUrl: string;
	if ((isLocalUrl && PUBLIC_IS_LOCAL === "true") || browser) {
		backendUrl = PUBLIC_BACKEND_URL;
	} else if (isLocalUrl) {
		backendUrl = PUBLIC_BACKEND_URL.replace("localhost", "backend");
	} else if (isStagingUrl) {
		backendUrl = "http://backend:80";
	} else {
		backendUrl = "http://backend:5070";
	}

	let wsUrl = backendUrl.replace(/^http/, "ws");
	
	const jwt = getJwtFromCookie();
	if (jwt) {
		const url = new URL(wsUrl);
		url.searchParams.set("token", jwt);
		wsUrl = url.toString();
	}

	return wsUrl;
}

export function createWebSocketClient(): SocketRouterClient | undefined {
	if (!browser) {
		return undefined;
	}

	const WS_URL = getWebSocketUrl();

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