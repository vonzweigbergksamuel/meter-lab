import { getKeyValueService } from "../../di/helpers.js";
import type { CachedDevices, Device } from "../../types/index.js";
import { correctDeviceFormat } from "./correctDeviceFormat.js";

/* -------- VARIABLES -------- */
let cachedConnectedDevices: CachedDevices[] = [];

async function setPayload(payload: Device[]) {
	await isSameDevicesConnected(payload);
}

async function isSameDevicesConnected(devices: Device[]) {
	if (cachedConnectedDevices.length === 0) {
		await updateCachedDevices(devices);
	} else {
		const cachedIds = new Set(cachedConnectedDevices.map((d) => d.meter_id));
		const newIds = new Set(devices.map((d) => String(d.meter_id)));

		// Only update when neccessary
		if (!isSameDevice(cachedIds, newIds)) {
			await removeDevices(cachedConnectedDevices);
			await updateCachedDevices(devices);
		}
	}
}

async function updateCachedDevices(devices: Device[]) {
	const service = getKeyValueService();

	// Place cached devices in redis
	for (const device of devices) {
		const NAME = `device-${device.meter_id}`;

		await service.set(NAME, "available");
	}

	const redisData = await service.getAll();
	cachedConnectedDevices = correctDeviceFormat(redisData);
}

function isSameDevice(cachedIds: Set<string>, newIds: Set<string>) {
	return (
		cachedIds.size === newIds.size &&
		[...cachedIds].every((id) => newIds.has(id))
	);
}

function removeDevices(devices: CachedDevices[]) {
	const service = getKeyValueService();

	for (const device of devices) {
		const NAME = `device-${device.meter_id}`;

		service.delete(NAME);
	}
}

export { setPayload };
