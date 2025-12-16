import type { TestData } from "../../../lib/db/schema/schema.js";
import type { Filter, TestInput, TestUpdate } from "./types.js";

export interface TestDB {
	findAll(filter?: Filter): Promise<TestData[]>;
	findById(id: number): Promise<TestData>;
	create(data: TestInput): Promise<TestData>;
	update(id: number, data: TestUpdate): Promise<TestData>;
	delete(id: number): Promise<void>;
}
