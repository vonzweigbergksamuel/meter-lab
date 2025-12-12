import type { TestData } from "../../../db/schema/schema.js";
import type { TestInput } from "./types.js";

export interface TestDB {
	findAll(): Promise<TestData[]>;
	findById(id: number): Promise<TestData>;
	create(data: TestInput): Promise<void>;
	delete(id: number): Promise<void>;
}
