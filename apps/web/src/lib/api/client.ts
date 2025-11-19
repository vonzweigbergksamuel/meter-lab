import type { AppRouterClient } from "@meter-lab/orpc";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { PUBLIC_BACKEND_URL } from "$env/static/public";

const link = new RPCLink({
	url: PUBLIC_BACKEND_URL,
	headers: () => ({})
});

export const apiClient: AppRouterClient = createORPCClient(link);
