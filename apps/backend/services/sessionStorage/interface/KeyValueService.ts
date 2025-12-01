export interface KeyValueService {
	set(field: string, value: any): Promise<void>;
	get(field: string): any;
	getAll(): Promise<Record<string, string>>;
	delete(field: string): Promise<void>;
}
