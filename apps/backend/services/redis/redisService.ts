import type { createClient } from "redis";
import { getRedis } from "../../config/redis.js";

type Status = "available" | "under_test";

// TODO Update value to deviceType
let redisService: RedisService;

/**
 * Service for managing device state in Redis using hash operations.
 * Stores device availability and status in a 'meter-lab-devices' hash.
 */
class RedisService {
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
	async hSet(field: string, value: Status) {
		return await this.#redis.hSet(this.#key, field, value);
	}

	/**
	 * Get a field value from the devices hash.
	 *
	 * @param {string} field - The device ID or field name to retrieve
	 * @returns {Promise<string | null>} The stored value or null if field doesn't exist
	 */
	async hGet(field: string) {
		return await this.#redis.hGet(this.#key, field);
	}

	/**
	 * Get all fields and values from the devices hash.
	 *
	 * @returns {Promise<Record<string, string>>} Object containing all device fields and values
	 */
	async hGetAll() {
		return await this.#redis.hGetAll(this.#key);
	}

	/**
	 * Delete a field from the devices hash.
	 *
	 * @param {string} field - The device ID or field name to delete
	 * @returns {Promise<number>} Number of fields that were deleted
	 */
	async hDel(field: string) {
		return await this.#redis.hDel(this.#key, field);
	}
}

function getRedisService() {
	if (!redisService) {
		redisService = new RedisService();
	}

	return redisService;
}

export { getRedisService };
