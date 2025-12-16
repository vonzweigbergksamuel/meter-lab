import type { Device } from "$lib/types/device";
import type { LayoutServerLoad } from "./$types";
import { createServerRpcClient } from "@/api/client";

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
	try {
		const jwt = locals.jwt || cookies.get("jwt");
		const rpcClient = createServerRpcClient(jwt);
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
