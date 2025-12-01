export const TOKENS = {
	/* --------- Services --------- */
	AuthService: Symbol("AuthService"),
	KeyValueService: Symbol("KeyValueStoreService"),
	MqttService: Symbol("MqttService"),
	PayloadService: Symbol("PayloadService"),
	/* --------- Controllers --------- */
	DeviceController: Symbol('DeviceController')
} as const;
