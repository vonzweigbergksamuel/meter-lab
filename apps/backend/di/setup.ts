import { MqttService } from "../core/services/iot-broker/mqtt.service.js";
import { PayloadService } from "../core/services/iot-broker/payload.service.js";
import type { KeyValueStoreService } from "../core/services/key-value-store/key-value-store.service.interface.js";
import { RedisService } from "../core/services/key-value-store/redis.service.js";
import { Container } from "./container.js";
import { TOKENS } from "./tokens.js";

export const container = new Container();

export async function injectDependencies() {
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

	container.register<MqttService>(
		TOKENS.MqttService,
		() =>
			new MqttService(container.resolve<PayloadService>(TOKENS.PayloadService)),
		"singleton",
	);
}
