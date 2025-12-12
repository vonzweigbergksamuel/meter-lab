import type { TestDataInsert } from "../../../db/schema/schema.js";

export type TestInput = Pick<
	TestDataInsert,
	"title" | "description" | "testType" | "devices"
>;
