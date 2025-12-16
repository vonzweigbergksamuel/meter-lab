import type { DeviceController } from "../api/controllers/device.controller.js";
import type { TestsController } from "../api/controllers/tests.controller.js";
import type { TestDBService } from "../core/services/database/testsDB.service.js";
import type { MqttService } from "../core/services/iot-broker/mqtt.service.js";
import type { PayloadService } from "../core/services/iot-broker/payload.service.js";
import type { KeyValueStoreService } from "../core/services/key-value-store/interface.js";
import type { RabbitServive } from "../core/services/queue/rabbit.service.js";
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

export const getTestDBService = () =>
	container.resolve<TestDBService>(TOKENS.TestDBService);

export const getRabbitService = () =>
	container.resolve<RabbitServive>(TOKENS.RabbitService);

/* --------- Controllers --------- */
export const getDeviceController = () =>
	container.resolve<DeviceController>(TOKENS.DeviceController);

export const getTestController = () =>
	container.resolve<TestsController>(TOKENS.TestController);
