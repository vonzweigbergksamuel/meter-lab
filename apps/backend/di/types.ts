import type { Container } from "./container.js";

export type ServiceToken<T = unknown> = string | symbol;
export type ServiceFactory<T> = (container: Container) => T;
export type ServiceLifecycle = "singleton" | "transient";

export interface ServiceRegistration<T> {
	factory: ServiceFactory<T>;
	lifecycle: ServiceLifecycle;
	instance?: T;
}
