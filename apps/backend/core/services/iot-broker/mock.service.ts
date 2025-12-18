import type { IIoTBrokerService, IPayloadService } from "./interface.js";
import type { Device } from "./types.js";

export class MockIoTBrokerService implements IIoTBrokerService {
	#payloadService: IPayloadService;
	#interval: NodeJS.Timeout | null = null;

	constructor(payloadService: IPayloadService) {
		this.#payloadService = payloadService;
	}

	async connect(): Promise<void> {
		console.log("Mock IoT Broker connected");
	}

	#generateMockDevices(count: number): Device[] {
		return Array.from({ length: count }, (_, i) => ({
			device_id: String(i + 1).padStart(3, "0"),
			value: Math.floor(Math.random() * 100),
			unit: "W",
		}));
	}

	listen(): void {
		const mockDevices: Device[] = this.#generateMockDevices(1000);

		this.#interval = setInterval(() => {
			this.#payloadService.setPayload(mockDevices);
		}, 10000);

		console.log("Mock IoT Broker listening (updates every 10s)");
	}

	dispose(): void {
		if (this.#interval) {
			clearInterval(this.#interval);
			this.#interval = null;
		}
	}
}
