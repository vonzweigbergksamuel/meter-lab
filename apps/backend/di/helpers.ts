import type { DeviceController } from "../api/controllers/device.controller.js";
import type { MqttService } from "../core/services/iot-broker/mqtt.service.js";
import type { PayloadService } from "../core/services/iot-broker/payload.service.js";
import type { KeyValueStoreService } from "../core/services/key-value-store/key-value-store.service.interface.js";
import { container } from "./setup.js";
import { TOKENS } from "./tokens.js";

// 	container.resolve<IAuthService>(TOKENS.AuthService);

/* --------- Services --------- */
export const getKeyValueStoreService = () =>
	container.resolve<KeyValueStoreService>(TOKENS.KeyValueService);

export const getPayloadService = () =>
	container.resolve<PayloadService>(TOKENS.PayloadService);

export const getMqttService = () =>
	container.resolve<MqttService>(TOKENS.MqttService);

/* --------- Controllers --------- */
export const getDeviceController = () =>
	container.resolve<DeviceController>(TOKENS.DeviceController);
