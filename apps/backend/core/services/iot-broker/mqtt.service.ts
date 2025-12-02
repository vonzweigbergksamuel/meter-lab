import mqtt from "mqtt";
import { env } from "../../../env.js";
import type {
	IIoTBrokerService,
	IPayloadService,
} from "./interface.js";
import type { Device, JemacDevice } from "./types.js";

export class MqttService implements IIoTBrokerService {
	#broker!: mqtt.MqttClient;
	#service: IPayloadService;

	constructor(service: IPayloadService) {
		this.#service = service;
	}

	async connect(): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			this.#broker = mqtt.connect(env.EMQX_URL, {
				username: env.EMQX_USERNAME,
				password: env.EMQX_PASSWORD,
			});

			this.#broker.on("connect", () => {
				this.#broker.subscribe(env.EMQX_TOPIC, (err) => {
					if (err) {
						console.error("Failed to subscribe: ", err);
						this.#broker.end();
						reject(err);
					}

					console.log("Connected to broker");
					resolve();
				});
			});

			this.#broker.on("error", (err) => {
				this.#broker.end();
				console.log("Connection to broker closed");
				reject(err);
			});
		});
	}

	listen() {
		this.#broker.on("message", (_topic, message) => {
			const data = this.#deviceDTO(message);
			this.#service.setPayload(data);
		});
	}

	#deviceDTO(payload: Buffer<ArrayBufferLike>): Device[] {
		const data = JSON.parse(payload.toString());

		return data.map((device: JemacDevice) => {
			return {
				device_id: device.meter_id,
				value: device.value,
				unit: device.unit,
			};
		});
	}
}
