import { getRedisService } from "../../services/redis/redisService.js";
import type { Device } from "../../types/index.js";

type CachedDevices = {
	meter_id: string;
	device_status: "available" | "under_test";
};

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
	console.log("Updated Devices");

	const redisService = getRedisService();

	// Place cached devices in redis
	for (const device of devices) {
		const NAME = `device-${device.meter_id}`;

		await redisService.hSet(NAME, "available");
	}

	const redisData = await redisService.hGetAll();
	// Fix correct format
	cachedConnectedDevices = Object.entries(redisData).map(([key, value]) => ({
		meter_id: key.replace("device-", ""),
		device_status: value as "available" | "under_test",
	}));

	console.log(cachedConnectedDevices);
}

function isSameDevice(cachedIds: Set<string>, newIds: Set<string>) {
	return (
		cachedIds.size === newIds.size &&
		[...cachedIds].every((id) => newIds.has(id))
	);
}

function removeDevices(devices: CachedDevices[]) {
	console.log("Removed Devices");

	const redisService = getRedisService();

	for (const device of devices) {
		const NAME = `device-${device.meter_id}`;

		redisService.hDel(NAME);
	}
}

export { setPayload };
