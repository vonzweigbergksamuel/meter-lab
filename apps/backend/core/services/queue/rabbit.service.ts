import amqp from "amqplib";
import { env } from "../../../env.js";
import type { IQueue } from "./interface.js";

export class RabbitServive implements IQueue {
	#queue: string;
	#channel: any;

	constructor() {
		this.#queue = "meter-lab/data";
	}

	connect(): Promise<void> {
		return new Promise((resolve, reject) => {
			amqp.connect(env.RABBIT_URL, (error0: any, connection: any) => {
				if (error0) {
					console.log(
						error0 && error0.message ? error0.message : String(error0),
					);
					reject(error0);
					return;
				}

				connection.on("error", (err: any) => {
					console.log(err.message);
					reject(err);
				});

				connection.on("close", () => {
					console.log("RabbitMQ conn closed");
					this.#channel = undefined;
				});

				console.log("RabbitMQ connected");

				connection.createChannel((error1: any, innerChannel: any) => {
					if (error1) {
						console.log(error1.message);
						reject(error1);
						return;
					}

					this.#channel = innerChannel;

					if (this.#channel) {
						this.#channel.assertQueue(
							this.#queue,
							{
								durable: true,
								arguments: {
									"x-queue-type": "quorum",
								},
							},
							(err: any, ok: any) => {
								if (err) {
									console.log(err.message);
									reject(err);
									return;
								}
								console.log("RabbitMQ queue asserted");
								resolve(connection);
							},
						);
					}
				});
			});
		});
	}

	addToQueue(value: unknown): void {
		if (!this.#channel) {
			throw new Error("Rabbit is not ready yes");
		}

		this.#channel.sendToQueue(this.#queue, Buffer.from(JSON.stringify(value)), {
			persistent: true,
		});
	}
}
