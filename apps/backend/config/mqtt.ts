import mqtt from "mqtt";
import { env } from "../env.js";
import type { Device } from "../types/index.js";
import { setPayload } from "../utils/devices/setPayload.js";

/* -------- VARIABLES -------- */
const EMQX_URL = env.EMQX_URL;
const EMQX_TOPIC = env.EMQX_TOPIC;
const EMQX_USERNAME = env.EMQX_USERNAME;
const EMQX_PASSWORD = env.EMQX_PASSWORD;

async function connectToMqtt() {
	console.log("Connecting to broker...");
	let client: mqtt.MqttClient;
	return new Promise<mqtt.MqttClient>((resolve, reject) => {
		client = mqtt.connect(EMQX_URL, {
			username: EMQX_USERNAME,
			password: EMQX_PASSWORD,
		});

		client.on("connect", () => {
			client.subscribe(EMQX_TOPIC, (err) => {
				if (err) {
					console.error("Failed to subscribe: ", err);
					client.end();
					reject(err);
				}

				console.log("Connected to broker");
				resolve(client);
			});
		});

		client.on("error", (err) => {
			client.end();
			console.log("Connection to broker closed");
			reject(err);
		});
	});
}

function listenForDevice(client: mqtt.MqttClient) {
	client.on("message", (_topic, message) => {
		// TODO Fix this
		// Later send this to a service to write to redis
		// console.log(message.toString())
		try {
			const payload: Device[] = JSON.parse(message.toString());
			setPayload(payload);
		} catch (err) {
			console.error("Failed to parse MQTT message:", err);
		}
	});
}

export { connectToMqtt, listenForDevice };
