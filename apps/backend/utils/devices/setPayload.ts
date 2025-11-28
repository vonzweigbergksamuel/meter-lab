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
    const cachedDevices = cachedConnectedDevices.sort()
    devices.sort();

    for (let i = 0; i < devices.length; i++) {
      // Only update devices if they are not the same ones connected
      if (!isSameDevice(devices[i], cachedDevices[i])) {
        console.log('FALSE')
        // Update devices
        await removeDevices(cachedDevices);
        await updateCachedDevices(devices);
        break
      } else {
        console.log('Not Updated Devices')
      }
    }
  } 
}

async function updateCachedDevices(devices: Device[]) {
  console.log("Updated Devices");

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

function isSameDevice(device, cachedDevice) {
  return device.meter_id === cachedDevice.meter_id
}

function removeDevices(devices: Device[]) {
  console.log("Removed Devices");

	const redisService = getRedisService();

  for (const device of devices) {
		const NAME = `device-${device.meter_id}`;

    redisService.hDel(NAME);
  }
}

export { setPayload };
