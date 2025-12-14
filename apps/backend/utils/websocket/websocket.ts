import { EventPublisher, eventIterator, type RouterClient } from "@orpc/server";
import * as z from "zod";
import { protectedProcedure } from "../../api/index.js";
import { testDataZodSchema } from "../../db/schema/schema.js";
import { WS_CHANNELS } from "./channels.js";
import type { CachedDevices } from "./types.js";

const devicesSchema = z.object({
	devices: z
		.object({
			device_id: z.string(),
			device_status: z.string(),
		})
		.array(),
});

export const publisher = new EventPublisher<{
	[WS_CHANNELS.DEVICE_UPDATE]: {
		devices: CachedDevices[];
	};
	[WS_CHANNELS.TEST_UPDATE]: z.infer<typeof testDataZodSchema>;
}>();

export function publish(
	channel: WS_CHANNELS,
	data: { devices: CachedDevices[] } | z.infer<typeof testDataZodSchema>,
) {
	// type narrowing/guard for safe publish
	if (channel === WS_CHANNELS.DEVICE_UPDATE && "devices" in data) {
		publisher.publish(channel, data as { devices: CachedDevices[] });
	} else if (
		channel === WS_CHANNELS.TEST_UPDATE &&
		"id" in data &&
		"title" in data
	) {
		publisher.publish(channel, data as z.infer<typeof testDataZodSchema>);
	} else {
		throw new Error(
			`Invalid data type for the channel ${channel}: expected ${
				channel === WS_CHANNELS.DEVICE_UPDATE
					? "'{ devices: CachedDevices[] }'"
					: "test data object with id and title"
			}`,
		);
	}
}

export const websocketRouter = {
	deviceUpdates: protectedProcedure
		.output(eventIterator(devicesSchema))
		.handler(async function* ({ signal }) {
			for await (const payload of publisher.subscribe(
				WS_CHANNELS.DEVICE_UPDATE,
				{
					signal,
				},
			)) {
				yield payload;
			}
		}),
	testUpdates: protectedProcedure
		.output(eventIterator(testDataZodSchema))
		.handler(async function* ({ signal }) {
			for await (const payload of publisher.subscribe(WS_CHANNELS.TEST_UPDATE, {
				signal,
			})) {
				yield payload;
			}
		}),
};

export type SocketRouter = typeof websocketRouter;
export type SocketRouterClient = RouterClient<typeof websocketRouter>;
