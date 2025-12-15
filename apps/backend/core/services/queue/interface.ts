export interface IQueue {
	connect(): Promise<void>;
	addToQueue(value: unknown): void;
}
