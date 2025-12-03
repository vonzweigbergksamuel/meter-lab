import { sendDataWSS } from "../../../utils/websocket/websocket.js";
import type { KeyValueStoreService } from "../key-value-store/interface.js";
import type { IPayloadService } from "./interface.js";
import type { CachedDevices, Device } from "./types.js";

export class PayloadService implements IPayloadService {
	#cachedConnectedDevices: CachedDevices[];
	#service: KeyValueStoreService;

	constructor(service: KeyValueStoreService) {
		this.#cachedConnectedDevices = [];
		this.#service = service;
	}

	clearPayload(): void {
		for (const device of this.#cachedConnectedDevices) {
			const NAME = device.device_id

			this.#service.delete(NAME)
		}	

		this.#cachedConnectedDevices = []

		// Send updated data to the client
		sendDataWSS(this.#cachedConnectedDevices);
	}

	async setPayload(payload: Device[]): Promise<void> {
		await this.#isSameDevicesConnected(payload);
	}

	async #isSameDevicesConnected(devices: Device[]) {
		const cachedIds = new Set(
			this.#cachedConnectedDevices.map((d) => d.device_id),
		);

		if (this.#cachedConnectedDevices.length === 0) {
			await this.#updateCachedDevices(devices, cachedIds);
		} else {
			const newIds = new Set(devices.map((d) => String(d.device_id)));

			// Only update when neccessary
			if (!this.#isSameDevice(cachedIds, newIds)) {
				await this.#removeDevices(newIds);
				await this.#updateCachedDevices(devices, cachedIds);
			}
		}
	}

	async #updateCachedDevices(newDevices: Device[], cachedIds: Set<string>) {
		// only update the devices in redis if they dont exist in redis already
		for (const device of newDevices) {
			if (!cachedIds.has(device.device_id)) {
				const NAME = device.device_id;
				await this.#service.set(NAME, "available");
			}
		}

		this.#cachedConnectedDevices = await this.#service.getAll();

		// Send updated data to the client
		sendDataWSS(this.#cachedConnectedDevices);
	}

	#isSameDevice(cachedIds: Set<string>, newIds: Set<string>) {
		return (
			cachedIds.size === newIds.size &&
			[...cachedIds].every((id) => newIds.has(id))
		);
	}

	async #removeDevices(newIds: Set<string>) {
		// only remove the devices that does not exist in newIds
		for (const device of this.#cachedConnectedDevices) {
			if (!newIds.has(device.device_id)) {
				const NAME = device.device_id;

				await this.#service.delete(NAME);
			}
		}
	}
}
