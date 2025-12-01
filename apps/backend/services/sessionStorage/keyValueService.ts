import type { KeyValueService as KeyValueServiceInterface } from "./interface/KeyValueService.js";

/**
 * Service for managing device state in key value storage using hash operations.
 * Stores device availability and status in a 'meter-lab-devices' hash.
 */
export class KeyValueService implements KeyValueServiceInterface {
	#service: KeyValueServiceInterface;

	constructor(keyValueService: KeyValueServiceInterface) {
		this.#service = keyValueService;
	}

	/**
	 * Set a field value in the devices hash.
	 *
	 * @param {string} field - The device ID or field name
	 * @param {string} value - The value to store (device state/availability)
	 * @returns {Promise<number>} Number of fields that were added (0 if updated)
	 */
	async set(field: string, value: any) {
		await this.#service.set(field, value);
	}

	/**
	 * Get a field value from the devices hash.
	 *
	 * @param {string} field - The device ID or field name to retrieve
	 * @returns {Promise<string | null>} The stored value or null if field doesn't exist
	 */
	async get(field: string): Promise<string | null> {
		return await this.#service.get(field);
	}

	/**
	 * Get all fields and values from the devices hash.
	 */
	async getAll(): Promise<Record<string, string>> {
		return await this.#service.getAll();
	}

	/**
	 * Delete a field from the devices hash.
	 *
	 * @param {string} field - The device ID or field name to delete
	 * @returns {Promise<void>}
	 */
	async delete(field: string): Promise<void> {
		await this.#service.delete(field);
	}
}
