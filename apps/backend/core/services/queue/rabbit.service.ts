import type { Channel } from "amqplib";
import * as amqp from "amqplib";
import { env } from "../../../env.js";
import type { IQueue } from "./interface.js";

export class RabbitServive implements IQueue {
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

	addToQueue(value: unknown): void {
		if (!this.#channel) {
			throw new Error("RabbitMQ is not ready yet");
		}

		this.#channel.sendToQueue(this.#queue, Buffer.from(JSON.stringify(value)), {
			persistent: true,
		});
	}
}
