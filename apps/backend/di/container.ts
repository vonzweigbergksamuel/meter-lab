import type {
	ServiceFactory,
	ServiceLifecycle,
	ServiceRegistration,
	ServiceToken,
} from "./types.js";

export class Container {
	private services = new Map<ServiceToken, ServiceRegistration<unknown>>();

	register<T>(
		token: ServiceToken<T>,
		factory: ServiceFactory<T>,
		lifecycle: ServiceLifecycle = "singleton",
	): void {
		this.services.set(token, { factory, lifecycle });
	}

	resolve<T>(token: ServiceToken<T>): T {
		const registration = this.services.get(token);

		if (!registration) {
			throw new Error(`Service not registered: ${String(token)}`);
		}

		if (registration.lifecycle === "singleton") {
			if (!registration.instance) {
				registration.instance = registration.factory(this);
			}
			return registration.instance as T;
		}

		return registration.factory(this) as T;
	}

	isRegistered(token: ServiceToken): boolean {
		return this.services.has(token);
	}
}
