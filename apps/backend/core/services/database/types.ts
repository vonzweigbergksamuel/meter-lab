import type { TestDataInsert } from "../../../lib/db/schema/schema.js";

export type TestInput = Pick<
	TestDataInsert,
	"title" | "description" | "testType" | "devices"
>;

export type TestUpdate = Partial<Omit<TestDataInsert, "id">>;

export type Filter = {
	limit?: number;
	endAt?: Date;
	testType?: "alive"; // TODO change to all the different test types
};
