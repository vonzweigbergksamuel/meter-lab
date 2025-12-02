import { createClient } from "redis";
import { env } from "../../../env.js";
import type { CachedDevices } from "../iot-broker/interface.js";
import type { KeyValueStoreService, Status } from "./interface.js";

/**
 * Service for managing device state in Redis using hash operations.
 * Stores device availability and status in a 'meter-lab-devices' hash.
 */
export class RedisService implements KeyValueStoreService {
	#redis: ReturnType<typeof createClient>;
	#key: string;

	constructor() {
		this.#redis = createClient({ url: env.REDIS_URL });
		this.#key = "meter-lab-devices";
	}

	async connect() {
		this.#redis.on("error", (error) => {
			console.error("Redis client error:", error);
		});

		await this.#redis.connect();
		console.log("Connected to redis");
	}

	/**
	 * Set a field value in the devices hash.
	 *
	 * @param {string} field - The device ID or field name
	 * @param {string} value - The value to store (device state/availability)
	 * @returns {Promise<number>} Number of fields that were added (0 if updated)
	 */
	async set(field: string, value: Status) {
		await this.#redis.hSet(this.#key, field, value);
	}

	/**
	 * Get a field value from the devices hash.
	 *
	 * @param {string} field - The device ID or field name to retrieve
	 * @returns {Promise<string>} The stored value or an empty string if field doesn't exist
	 */
	async get(field: string): Promise<Status | string> {
		const value = await this.#redis.hGet(this.#key, field);

		if (value === null) {
			return "";
		}

		return value;
	}

	/**
	 * Get all fields and values from the devices hash.
	 */
	async getAll() {
		const result = await this.#redis.hGetAll(this.#key);

		return this.dataDTO(result);
	}

	/**
	 * Delete a field from the devices hash.
	 *
	 * @param {string} field - The device ID or field name to delete
	 * @returns {Promise<void>}
	 */
	async delete(field: string): Promise<void> {
		await this.#redis.hDel(this.#key, field);
	}

	dataDTO(data: Record<string, unknown>): CachedDevices[] {
		return Object.entries(data).map(([field, value]) => ({
			device_id: field,
			device_status: value,
		})) as CachedDevices[];
	}
}
