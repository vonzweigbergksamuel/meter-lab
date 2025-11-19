import type { AppRouterClient } from "@meter-lab/orpc";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { BACKEND_URL } from "$env/static/private";

const link = new RPCLink({
	url: BACKEND_URL,
	headers: () => ({})
});

export const apiClient: AppRouterClient = createORPCClient(link);
