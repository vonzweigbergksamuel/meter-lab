import type { Channel } from "amqplib";
import * as amqp from "amqplib";
import { env } from "../../env.js";
import { mockTestRun } from "./mockTesstRun.js";

export class RabbitServive {
	#queue: string;
	#channel: Channel | null = null;

	constructor() {
		this.#queue = env.RABBIT_QUEUE;
	}

	async connect(): Promise<void> {
		try {
			const connection = await amqp.connect(env.RABBIT_URL);

			connection.on("error", (err) => {
				console.error("RabbitMQ connection error:", err.message);
				this.#channel = null;
			});

			connection.on("close", () => {
				console.log("RabbitMQ connection closed");
				this.#channel = null;
			});

			console.log("RabbitMQ connected");

			const channel = await connection.createChannel();
			this.#channel = channel;

			await channel.assertQueue(this.#queue, {
				durable: true,
				arguments: {
					"x-queue-type": "quorum",
				},
			});
		} catch (error) {
			console.error("Failed to connect to RabbitMQ:", error);
			throw error;
		}
	}

	listenQueue(): void {
		if (!this.#channel) {
			throw new Error("RabbitMQ is not ready yet");
		}

		this.#channel.consume(
			this.#queue,
			async (msg: amqp.ConsumeMessage | null) => {
				if (!msg) {
					return;
				}

				const content = msg.content.toString();
				const data = JSON.parse(content);
				console.log("Received message:", data);

				// Acknowledge the message
				this.#channel?.ack(msg);

				await mockTestRun(data);
			},
		);
	}
}
