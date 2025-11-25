import type { AppRouterClient } from "@meter-lab/orpc";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { PUBLIC_BACKEND_URL } from "$env/static/public";

const backendUrl = `${PUBLIC_BACKEND_URL}/rpc`;

const link = new RPCLink({
	url: backendUrl,
	headers: () => ({})
});

const apiClient: AppRouterClient = createORPCClient(link);
export const orpc = createTanstackQueryUtils(apiClient);
