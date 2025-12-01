/* ------- Interfaces ------- */
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

/* ------- Types ------- */

export type Device = {
	device_id: string;
	value: number;
	unit: string;
};

export type CachedDevices = {
	device_id: string;
	device_status: "available" | "under_test";
};

export type JemacDevice = {
	meter_id: string;
	value: number;
	unit: string;
};
