export type Device = {
	meter_id: string;
	value: number;
	unit: string;
};

export type CachedDevices = {
	meter_id: string;
	device_status: "available" | "under_test";
};