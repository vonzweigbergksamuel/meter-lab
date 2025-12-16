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

const MAX_RETRIES = 5;
const INITIAL_RETRY_DELAY = 1000;
const MAX_RETRY_DELAY = 30000;

function createWebSocketWithRetry(
	url: string,
	onOpen?: () => void,
	onError?: (error: Event) => void,
	onClose?: () => void,
): WebSocket {
	let retryCount = 0;
	let currentWebSocket: WebSocket | null = null;
	let isReconnecting = false;

	const connect = (): WebSocket => {
		if (isReconnecting) {
			return currentWebSocket!;
		}

		console.log(`WS: Attempting connection (attempt ${retryCount + 1}/${MAX_RETRIES + 1})`);
		currentWebSocket = new WebSocket(url);

		currentWebSocket.addEventListener("open", () => {
			console.log("WS OPEN ✅", currentWebSocket?.readyState);
			retryCount = 0;
			isReconnecting = false;
			onOpen?.();
		});

		currentWebSocket.addEventListener("error", (err) => {
			console.error("WS ERROR ❌", err);
			onError?.(err);
		});

		currentWebSocket.addEventListener("close", (event) => {
			console.log("WS CLOSED ⛔", { code: event.code, reason: event.reason });
			onClose?.();

			if (retryCount < MAX_RETRIES && !event.wasClean) {
				const delay = Math.min(
					INITIAL_RETRY_DELAY * Math.pow(2, retryCount),
					MAX_RETRY_DELAY,
				);
				console.log(`WS: Retrying in ${delay}ms...`);
				retryCount++;
				isReconnecting = true;
				setTimeout(() => {
					if (currentWebSocket?.readyState === WebSocket.CLOSED) {
						connect();
					}
				}, delay);
			} else if (retryCount >= MAX_RETRIES) {
				console.error("WS: Max retries reached. Giving up.");
			}
		});

		return currentWebSocket;
	};

	return connect();
}

export function createWebSocketClient(): SocketRouterClient | undefined {
	if (!browser) {
		return undefined;
	}

	const WS_URL = getWebSocketUrl();

	console.log("WS url: ", WS_URL);

	const websocket = createWebSocketWithRetry(WS_URL);

	const link = new RPCLink({ websocket });

	return createORPCClient(link) as SocketRouterClient;
}
