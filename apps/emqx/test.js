import mqtt from "mqtt";

/* -------- VARIABLES -------- */
const BROKER_URL = "mqtt://localhost:1884";
const TOPIC = "mock-data";

console.log("Application started!");

// Connect to EMQX
const client = mqtt.connect(BROKER_URL);

client.on("connect", () => {
	client.subscribe(TOPIC, (error) => {
		if (!error) {
      console.log('Connected')
		}
	});
});

client.on("error", (err) => {
	console.error("MQTT error:", err);
});

// Listens to messages
client.on("message", (_, message) => {
	console.log(message.toString());
});
