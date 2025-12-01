import type { createClient } from "redis";
import { getRedis } from "../../../config/redis.js";
import type { KeyValueService } from "../interface/KeyValueService.js";

type Status = "available" | "under_test";

// TODO Update value to deviceType
// let redisService: RedisService;

/**
 * Service for managing device state in Redis using hash operations.
 * Stores device availability and status in a 'meter-lab-devices' hash.
 */
export class RedisService implements KeyValueService {
	#redis: ReturnType<typeof createClient>;
	#key: string;

	constructor() {
		this.#redis = getRedis();
		this.#key = "meter-lab-devices";
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
	 * @returns {Promise<string | null>} The stored value or null if field doesn't exist
	 */
	async get(field: string) {
		return await this.#redis.hGet(this.#key, field);
	}

	/**
	 * Get all fields and values from the devices hash.
	 */
	async getAll() {
		return await this.#redis.hGetAll(this.#key);
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
}

// function getRedisService() {
// 	if (!redisService) {
// 		redisService = new RedisService();
// 	}

// 	return redisService;
// }

// export { getRedisService };
