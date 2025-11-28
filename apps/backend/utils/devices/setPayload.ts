import { getRedisService } from "../../services/redis/redisService.js";
import type { Device } from "../../types/index.js";

/* -------- VARIABLES -------- */
let cachedConnectedDevices: Device[] = [];

async function setPayload(payload: Device[]) {
	await isSameDevicesConnected(payload);
}

async function isSameDevicesConnected(devices: Device[]) {
	if (cachedConnectedDevices.length === 0) {
		console.log(devices);
		await updateCachedDevices(devices);
	} else {
		console.log("Cached Devices:", cachedConnectedDevices);
	}
}

async function updateCachedDevices(devices: Device[]) {
	const redisService = getRedisService();

	// Place cached devices in redis
	for (const device of devices) {
		const NAME = `device-${device.meter_id}`;

		redisService.hSet(NAME, device);
	}

	// Retrieve all devices from Redis, transform to Device[] for our cache
	const redisDevicesObj = await redisService.hGetAll();
	const devicesArr: Device[] = Object.values(redisDevicesObj).map((d: any) =>
		typeof d === "string" ? JSON.parse(d) : d
	);
	cachedConnectedDevices = devicesArr;
}

export { setPayload };
