import type { AppRouterClient } from "@meter-lab/orpc";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { browser } from "$app/environment";
import { PUBLIC_BACKEND_URL, PUBLIC_IS_LOCAL } from "$env/static/public";

const isLocalUrl = PUBLIC_BACKEND_URL.includes("localhost");
const isStagingUrl = PUBLIC_BACKEND_URL.includes("nordicode");

function getBackendUrl(): string {
	if ((isLocalUrl && PUBLIC_IS_LOCAL === "true") || browser) {
		return PUBLIC_BACKEND_URL;
	}

	if (isLocalUrl) {
		return PUBLIC_BACKEND_URL.replace("localhost", "backend");
	}

	if (isStagingUrl) {
		// return "http://backend:80";
		return PUBLIC_BACKEND_URL
	}

	return "http://backend:5070";
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

let jwtToken: string | null = null;

export function setClientJwt(token: string | null) {
	jwtToken = token;
}

function createRpcClient(jwt?: string | null): AppRouterClient {
	const backendUrl = getBackendUrl();
	console.log("Backend URL:", backendUrl);

	const rpcLink = new RPCLink({
		url: `${backendUrl}/rpc`,
		headers: () => {
			// Use provided JWT, or fall back to token/cookie for client-side
			const authJwt = jwt ?? (browser ? jwtToken || getJwtFromCookie() : null);
			if (authJwt) {
				return {
					Authorization: `Bearer ${authJwt}`
				};
			}
			return {};
		}
	});

	return createORPCClient(rpcLink);
}

// Singleton for client-side use
export const rpcClient: AppRouterClient = createRpcClient();

// Factory function for server-side use (can also be used client-side with explicit JWT)
export function createServerRpcClient(jwt?: string | null): AppRouterClient {
	return createRpcClient(jwt);
}
