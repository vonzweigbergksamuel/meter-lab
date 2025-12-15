import { getKeyValueStoreService } from "../../di/helpers.js";

export class DeviceController {
	async getDevices() {
		const service = getKeyValueStoreService();
		const data = await service.getAll();

		console.log(data);
		return { devices: data };
	}
}
