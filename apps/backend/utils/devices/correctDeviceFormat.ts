import type { CachedDevices } from "../../types/index.js";

export function correctDeviceFormat(redisData: Record<string, string>) {
	// Fix correct format
	return Object.entries(redisData).map(([key, value]) => ({
		meter_id: key.replace("device-", ""),
		device_status: value,
	})) as CachedDevices[];
}
