import type { CachedDevices } from "../iot-broker/interface/iot-broker.service.interface.js";

export interface KeyValueStoreService {
	connect(): Promise<void>;
	set(field: string, value: unknown): Promise<void>;
	get(field: string): Promise<Status | string>;
	getAll(): Promise<CachedDevices[]>;
	delete(field: string): Promise<void>;
	dataDTO(data: Record<string, unknown>): CachedDevices[];
}

export type Status = "available" | "under_test";
