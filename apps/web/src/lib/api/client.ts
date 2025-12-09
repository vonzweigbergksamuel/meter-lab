import type { AppRouterClient } from "@meter-lab/orpc";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { browser } from "$app/environment";
import { PUBLIC_BACKEND_URL } from "$env/static/public";

const isLocalUrl = PUBLIC_BACKEND_URL.includes("localhost");

const devUrl = browser
	? PUBLIC_BACKEND_URL
	: PUBLIC_BACKEND_URL.replace("localhost", "host.docker.internal");

const backendUrl = isLocalUrl ? devUrl : PUBLIC_BACKEND_URL;

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

console.log(backendUrl);

const rpcLink = new RPCLink({
	url: `${backendUrl}/rpc`,
	headers: () => {
		const jwt = jwtToken || getJwtFromCookie();
		if (jwt) {
			console.log("Sending JWT with request:", jwt.substring(0, 20) + "...");
			return {
				Authorization: `Bearer ${jwt}`
			};
		}
		console.warn("No JWT found in cookie or token");
		return {};
	}
});

const rpcClient: AppRouterClient = createORPCClient(rpcLink);
export const rpc = createTanstackQueryUtils(rpcClient);
export { rpcClient };
