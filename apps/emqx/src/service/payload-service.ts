import { env } from "../../env.js";
import { generateDeviceId } from "../utils/generate-device-id.js";
import { generatePayload } from "../utils/generate-payload.js";

type Payload = {
	meter_id: number; // We use Date.now()
	value: number;
	unit: string;
};

class PayloadService {
	#devices: number[];
	#numOfDevices;

	constructor() {
		this.#devices = [];
		this.#numOfDevices = Number(env.NUM_DEVICE);

		this.#generateDevices();
	}

	#generateDevices() {
		for (let i = 0; i < this.#numOfDevices; i++) {
			const deviceId = generateDeviceId();
			this.#devices.push(deviceId);
		}
	}

	getPayload() {
		const payload: Payload[] = [];

		for (const deviceId of this.#devices) {
			const data = generatePayload(deviceId);

			payload.push(data);
		}

		return JSON.stringify(payload);
	}
}

export { PayloadService };
