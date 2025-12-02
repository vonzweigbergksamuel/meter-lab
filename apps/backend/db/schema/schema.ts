import { pgSchema, serial, text, timestamp } from "drizzle-orm/pg-core";

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
	startAt: timestamp("start_at").notNull(),
	endAt: timestamp("end_at").notNull(),
	status: testStatus("status").notNull().default("pending"),
	devices: text("device_id").array().notNull(),
});
