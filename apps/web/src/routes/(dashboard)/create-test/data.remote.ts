// import type { AppRouterClient } from "@meter-lab/orpc";
// import { createORPCClient } from "@orpc/client";
// import { RPCLink } from "@orpc/client/fetch";
import { form, getRequestEvent } from "$app/server";
// import { PUBLIC_BACKEND_URL } from "$env/static/public";
import { z } from "zod";

const createTestSchema = z.object({
	title: z.string().min(1, "Required"),
	description: z.string().min(1, "Required"),
	testType: z.enum(["alive", "stress"], {
		errorMap: () => ({ message: "Select a valid test type" })
	}),
	devices: z.array(z.string()).min(1, "Select at least one device")
});

export const createTest = form(createTestSchema, async (data) => {
	try {
		console.log("data", data);
		// const event = getRequestEvent();
		// const jwt = event.locals.jwt || event.cookies.get("jwt");

		// const rpcLink = new RPCLink({
		// 	url: `${PUBLIC_BACKEND_URL}/rpc`,
		// 	headers: () => {
		// 		if (jwt) {
		// 			return {
		// 				Authorization: `Bearer ${jwt}`
		// 			};
		// 		}
		// 		return {};
		// 	}
		// });

		// const rpcClient: AppRouterClient = createORPCClient(rpcLink);
		// const response = await rpcClient.createTest({
		// 	title: data.title,
		// 	description: data.description,
		// 	testType: data.testType,
		// 	devices: data.devices
		// });

		// if (!response.success) {
		// 	throw new Error(response.message || "Failed to create test");
		// }

		return {
			success: true
			// testId: response.testId,
			// message: response.message
		};
	} catch (error) {
		console.error("Error creating test:", error);
		throw new Error(
			error instanceof Error ? error.message : "Failed to create test. Please try again."
		);
	}
});
