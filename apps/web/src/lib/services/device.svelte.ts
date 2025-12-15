import type { SocketRouterClient } from "@meter-lab/orpc";
import type { Device } from "$lib/types/device";
import { getContext, setContext } from "svelte";

const DEFAULT_KEY = "$_device_service";

export class DeviceService {
	devices = $state<Device[]>([]);
	loading = $state<boolean>(false);
	error = $state<Error | null>(null);
	status = $state<"idle" | "connected" | "disconnected">("idle");

	all = $derived(this.devices);
	available = $derived(this.devices.filter((d) => d.device_status === "available"));
	unavailable = $derived(this.devices.filter((d) => d.device_status === "under_test"));

	hydrate(devices: Device[]) {
		this.devices = devices;
		this.loading = false;
		this.error = null;
	}

	async startStreaming(wsClient: SocketRouterClient) {
		if (this.status === "connected") {
			return;
		}

		this.status = "connected";
		this.loading = false;

		try {
			const stream = await wsClient.deviceUpdates();

			for await (const event of stream) {
				if (event?.devices && Array.isArray(event.devices)) {
					this.updateDevices(event.devices as Device[]);
				}
			}
		} catch (error) {
			console.error("WebSocket error:", error);
			this.error = error instanceof Error ? error : new Error(String(error));
			this.status = "disconnected";
		}
	}

	private updateDevices(newDevices: Device[]) {
		const newDeviceIds = newDevices.map((d) => d.device_id);

		this.devices = this.devices.filter((d) => newDeviceIds.includes(d.device_id));

		for (const newDevice of newDevices) {
			const existingIndex = this.devices.findIndex((d) => d.device_id === newDevice.device_id);
			if (existingIndex >= 0) {
				if (this.devices[existingIndex].device_status !== newDevice.device_status) {
					this.devices[existingIndex] = newDevice;
				}
			} else {
				this.devices.push(newDevice);
			}
		}
	}
}

export const getDeviceService = (key = DEFAULT_KEY) => {
	return getContext<DeviceService>(key);
};

export const setDeviceService = (service: DeviceService, key = DEFAULT_KEY) => {
	return setContext(key, service);
};
