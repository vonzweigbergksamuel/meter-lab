import type { TestDataInsert } from "../../../db/schema/schema.js";

export type TestInput = Pick<
	TestDataInsert,
	"title" | "description" | "testType" | "devices"
>;

export type Filter = {
	limit?: number;
	endAt?: Date;
	testType?: "alive"; // TODO change to all the different test types
};
