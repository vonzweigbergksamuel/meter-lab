import {
	EventPublisher,
	eventIterator,
	os,
	type RouterClient,
} from "@orpc/server";
import * as z from "zod";
import type { CachedDevices } from "../../core/services/iot-broker/types.js";

const devicesSchema = z.object({
	devices: z
		.object({
			device_id: z.string(),
			device_status: z.string(),
		})
		.array(),
});

export const publisher = new EventPublisher<{
	"device-updated": {
		devices: CachedDevices[];
	};
}>();

export function publish(data: CachedDevices[]) {
	publisher.publish("device-updated", { devices: data });
}

export const websocketRouter = {
	liveUpdates: os
		.output(eventIterator(devicesSchema))
		.handler(async function* ({ input, signal }) {
			for await (const payload of publisher.subscribe("device-updated", {
				signal,
			})) {
				yield payload;
			}
		}),
};

export type SocketRouter = typeof websocketRouter;
export type SocketRouterClient = RouterClient<typeof websocketRouter>;
