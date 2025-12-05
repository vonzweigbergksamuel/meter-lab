import type { AppRouterClient } from "@meter-lab/orpc";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { browser } from "$app/environment";
import { PUBLIC_BACKEND_URL } from "$env/static/public";

// Temporary solution to handle local development on localhost with docker
// TODO: Implement proper solution for production?
const isLocalUrl = PUBLIC_BACKEND_URL.includes("localhost");

const devUrl = browser
	? PUBLIC_BACKEND_URL
	: PUBLIC_BACKEND_URL.replace("localhost", "host.docker.internal");

const backendUrl = isLocalUrl ? devUrl : PUBLIC_BACKEND_URL;

const rpcLink = new RPCLink({
	url: `${backendUrl}/rpc`,
	headers: () => ({})
});

const rpcClient: AppRouterClient = createORPCClient(rpcLink);
export const rpc = createTanstackQueryUtils(rpcClient);
