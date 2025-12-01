import { getKeyValueService } from "../../di/helpers.js";
import type { CachedDevices, Device } from "../../types/index.js";
import { correctDeviceFormat } from "./correctDeviceFormat.js";

/* -------- VARIABLES -------- */
let cachedConnectedDevices: CachedDevices[] = [];

async function setPayload(payload: Device[]) {
	await isSameDevicesConnected(payload);
}

async function isSameDevicesConnected(devices: Device[]) {
	const cachedIds = new Set(cachedConnectedDevices.map((d) => d.meter_id));

	if (cachedConnectedDevices.length === 0) {
		await updateCachedDevices(devices, cachedIds);
	} else {
		const newIds = new Set(devices.map((d) => String(d.meter_id)));

		// Only update when neccessary
		if (!isSameDevice(cachedIds, newIds)) {
			await removeDevices(newIds);
			await updateCachedDevices(devices, cachedIds);
		}
	}
}

async function updateCachedDevices(
	newDevices: Device[],
	cachedIds: Set<string>,
) {
	const service = getKeyValueService();

	// only update the devices in redis if they dont exist in redis already
	for (const device of newDevices) {
		if (!cachedIds.has(device.meter_id)) {
			const NAME = `device-${device.meter_id}`;
			await service.set(NAME, "available");
		}
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

async function removeDevices(newIds: Set<string>) {
	const service = getKeyValueService();

	// only remove the devices that does not exist in newIds
	for (const device of cachedConnectedDevices) {
		if (!newIds.has(device.meter_id)) {
			const NAME = `device-${device.meter_id}`;

			await service.delete(NAME);
		}
	}
}

export { setPayload };
