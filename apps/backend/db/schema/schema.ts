import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pgSchema, serial, text, timestamp } from "drizzle-orm/pg-core";
import * as z from "zod";

export const testDataSchema = pgSchema("test_data");

export const testType = testDataSchema.enum("test_type", ["alive"]);
export const testStatus = testDataSchema.enum("test_status", [
	"pending",
	"running",
	"completed",
	"failed",
]);

export const testData = testDataSchema.table("test_data", {
	id: serial("id").primaryKey(),
	title: text("title").notNull(),
	description: text("description").notNull(),
	testType: testType("test_type").notNull(),
	startAt: timestamp("start_at"),
	endAt: timestamp("end_at"),
	status: testStatus("status").notNull().default("pending"),
	devices: text("device_id").array().notNull(),
});

export type TestData = InferSelectModel<typeof testData>;
export type TestDataInsert = InferInsertModel<typeof testData>;

export const testDataZodSchema = z.object({
	id: z.number(),
	title: z.string(),
	description: z.string(),
	testType: z.literal("alive"),
	startAt: z.date().nullable(),
	endAt: z.date().nullable(),
	status: z.enum(["pending", "running", "completed", "failed"]),
	devices: z.array(z.string()),
});
