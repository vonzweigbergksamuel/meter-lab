export const TOKENS = {
	/* --------- Services --------- */
	AuthService: Symbol("AuthService"),
	KeyValueService: Symbol("KeyValueStoreService"),
	MqttService: Symbol("MqttService"),
	PayloadService: Symbol("PayloadService"),

	/* --------- Controllers --------- */
	DeviceController: Symbol("DeviceController"),
	TestController: Symbol("TestController"),
} as const;
