import {
	EventPublisher,
	eventIterator,
	os,
	type RouterClient,
} from "@orpc/server";
import * as z from "zod";
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
	[WS_CHANNELS.DEVICE_TEST]: {
		devices: CachedDevices[];
	};
}>();

export function publish(channel: WS_CHANNELS, data: CachedDevices[]) {
		publisher.publish(channel as WS_CHANNELS, { devices: data });
	}

export const websocketRouter = {
	deviceUpdates: os
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
	liveTest: os.output(eventIterator(devicesSchema)).handler(async function* ({
		signal,
	}) {
		for await (const payload of publisher.subscribe(WS_CHANNELS.DEVICE_TEST, {
			signal,
		})) {
			yield payload;
		}
	}),
};

export type SocketRouter = typeof websocketRouter;
export type SocketRouterClient = RouterClient<typeof websocketRouter>;
