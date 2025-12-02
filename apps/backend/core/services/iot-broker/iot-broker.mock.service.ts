import type {
	Device,
	IIoTBrokerService,
	IPayloadService,
} from "./interface/iot-broker.service.interface.js";

export class MockIoTBrokerService implements IIoTBrokerService {
	#payloadService: IPayloadService;
	#interval: NodeJS.Timeout | null = null;

	constructor(payloadService: IPayloadService) {
		this.#payloadService = payloadService;
	}

	async connect(): Promise<void> {
		console.log("Mock IoT Broker connected");
	}

	listen(): void {
		const mockDevices: Device[] = [
			{ device_id: "meter-001", value: 45, unit: "W" },
			{ device_id: "meter-002", value: 23, unit: "W" },
			{ device_id: "meter-003", value: 12, unit: "W" },
		];

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
