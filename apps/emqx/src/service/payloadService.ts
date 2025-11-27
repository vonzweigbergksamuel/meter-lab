import { env } from "../../env";
import { generateDeviceId } from "../utils/generateDeviceId";
import { generatePayload } from "../utils/generatePayload";

type Payload = {
  meter_id: string,
  value: number,
  unit: string
}


class PayloadService {
	#devices;
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
    const payload: Payload[] = []

    for (const deviceId of this.#devices) {
      const data = generatePayload(deviceId)

      payload.push(data)
    }

    return JSON.stringify(payload)
  }
}

export { PayloadService };