import type { AppRouterClient } from "@meter-lab/orpc";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { PUBLIC_BACKEND_URL } from "$env/static/public";
import type { Device } from "$lib/types/device";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
	try {
		const jwt = locals.jwt || cookies.get("jwt");

		const rpcLink = new RPCLink({
			url: `${PUBLIC_BACKEND_URL}/rpc`,
			headers: () => {
				if (jwt) {
					return {
						Authorization: `Bearer ${jwt}`
					};
				}
				return {};
			}
		});

		const rpcClient: AppRouterClient = createORPCClient(rpcLink);
		const response = await rpcClient.device({});

		return {
			session: locals.session,
			initialDevices: (response.devices || []) as Device[]
		};
	} catch (error) {
		console.error("Error fetching devices:", error);
		return {
			session: locals.session,
			initialDevices: [] as Device[]
		};
	}
};
