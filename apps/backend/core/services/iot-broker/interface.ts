import type { Device } from "./types.js";

export interface IIoTBrokerService {
	connect(): Promise<void>;
	listen(): void;
}

export interface IoTData {
	device_id: string;
	status: "available" | "under_test";
}

export interface IPayloadService {
	setPayload(payload: Device[]): Promise<void>;
}
