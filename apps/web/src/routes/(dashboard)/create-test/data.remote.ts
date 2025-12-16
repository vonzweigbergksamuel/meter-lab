import { createServerRpcClient } from "@/api/client";
import { form, getRequestEvent } from "$app/server";
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
		const event = getRequestEvent();
		const jwt = event.locals.jwt || event.cookies.get("jwt");

		const rpcClient = createServerRpcClient(jwt);
		const response = await rpcClient.tests.createTests({
			title: data.title,
			description: data.description,
			testType: data.testType,
			devices: data.devices
		});

		if (!response.success) {
			throw new Error("Failed to create test");
		}

		return {
			success: true,
			testId: response.testId
		};
	} catch (error) {
		console.error("Error creating test:", error);
		throw new Error(
			error instanceof Error ? error.message : "Failed to create test. Please try again."
		);
	}
});
