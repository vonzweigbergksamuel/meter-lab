import mqtt from "mqtt";
import { env } from "../env.js";
import { PayloadService } from "./service/payloadService.js";

/* -------- VARIABLES -------- */
const BROKER_URL = env.BROKER_URL;
const TOPIC = env.TOPIC;
const USERNAME = env.USERNAME;
const PASSWORD = env.PASSWORD;

console.log("Application started!");

// Connect to EMQX
const client = mqtt.connect(BROKER_URL, {
	username: USERNAME,
	password: PASSWORD,
});

client.on("connect", () => {
	const service = new PayloadService();
	client.subscribe(TOPIC, (error) => {
		if (!error) {
			setInterval(() => {
				const data = service.getPayload();

				client.publish(TOPIC, data);
			}, 10_000); // 10 secconds
		}
	});
});

client.on("error", (err) => {
	console.error("MQTT error:", err);
});

client.on("message", (topic, message) => {
	console.log(message.toString());
	console.log(topic.toString());
});
