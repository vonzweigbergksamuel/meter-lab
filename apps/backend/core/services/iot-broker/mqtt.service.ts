import mqtt from "mqtt";
import { env } from "../../../env.js";
import type { IIoTBrokerService, IPayloadService } from "./interface.js";
import type { Device, JemacDevice } from "./types.js";

export class MqttService implements IIoTBrokerService {
	#broker!: mqtt.MqttClient;
	#service: IPayloadService;
	#messageTimeout: NodeJS.Timeout | undefined;

	constructor(service: IPayloadService) {
		this.#service = service;
	}

	async connect(): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			this.#broker = mqtt.connect(env.EMQX_URL, {
				username: env.EMQX_USERNAME,
				password: env.EMQX_PASSWORD,
				reconnectPeriod: 30 * 1000, // Wait 30s between each retry
				connectTimeout: 10 * 1000, // Give up after 10s
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

					this.#broker.on("error", (err) => {
						console.log("Connection to broker closed");
						reject(err);
					});

					this.#broker.on("disconnect", () => {
						console.log("Disconnected from broker");
						this.#service.clearPayload();
					});
				});
			});
		});
	}

	listen() {
		this.#broker.on("message", (_topic, message) => {
			if (this.#broker.connected) {
				if (this.#messageTimeout) {
					clearTimeout(this.#messageTimeout);
				}

				this.#messageTimeout = setTimeout(() => {
					console.log("No data for 20s, clearing payload");
					this.#service.clearPayload();
				}, 20 * 1000); // 20 secconds

				// Setpayload
				const data = this.#deviceDTO(message);
				this.#service.setPayload(data);
			}
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
