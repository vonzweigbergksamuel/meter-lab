import { DeviceController } from "../api/controllers/device.controller.js";
import { TestsController } from "../api/controllers/tests.controller.js";
import { TestDBService } from "../core/services/database/testsDB.service.js";
import type { IIoTBrokerService } from "../core/services/iot-broker/interface.js";
import { MockIoTBrokerService } from "../core/services/iot-broker/mock.service.js";
import { MqttService } from "../core/services/iot-broker/mqtt.service.js";
import { PayloadService } from "../core/services/iot-broker/payload.service.js";
import type { KeyValueStoreService } from "../core/services/key-value-store/interface.js";
import { RedisService } from "../core/services/key-value-store/redis.service.js";
import { env } from "../env.js";
import { Container } from "./container.js";
import { TOKENS } from "./tokens.js";

export const container = new Container();

export function injectDependencies() {
	container.register<KeyValueStoreService>(
		TOKENS.KeyValueService,
		() => new RedisService(),
		"singleton",
	);

	container.register<PayloadService>(
		TOKENS.PayloadService,
		() =>
			new PayloadService(
				container.resolve<KeyValueStoreService>(TOKENS.KeyValueService),
			),
		"singleton",
	);

	container.register<IIoTBrokerService>(
		TOKENS.MqttService,
		() =>
			env.NODE_ENV === "testing" || env.NODE_ENV === "stage"
				? new MockIoTBrokerService(
						container.resolve<PayloadService>(TOKENS.PayloadService),
					)
				: new MqttService(
						container.resolve<PayloadService>(TOKENS.PayloadService),
					),
		"singleton",
	);

	container.register<DeviceController>(
		TOKENS.DeviceController,
		() => new DeviceController(),
		"singleton",
	);
	
	container.register<TestDBService>(
		TOKENS.TestDBService,
		() => new TestDBService(),
		"singleton",
	);
	container.register<TestsController>(
		TOKENS.TestController,
		() => new TestsController(
			container.resolve<TestDBService>(TOKENS.TestDBService)
		),
		"singleton",
	);

}
