import type { TestData } from "../../../db/schema/schema.js";
import type { Filter, TestInput } from "./types.js";

export interface TestDB {
	findAll(filter?: Filter): Promise<TestData[]>;
	findById(id: number): Promise<TestData>;
	create(data: TestInput): Promise<void>;
	delete(id: number): Promise<void>;
}
