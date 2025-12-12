import { ORPCError } from "@orpc/client";
import { eq } from "drizzle-orm";
import { db } from "../../../db/index.js";
import {
	type TestData,
	type TestDataInsert,
	testData,
} from "../../../db/schema/schema.js";
import type { TestDB } from "./interface.js";
import type { TestInput } from "./types.js";

export class TestDBService implements TestDB {
	async findAll(): Promise<TestData[]> {
		try {
			return await db.select().from(testData);
		} catch (error) {
			console.error(error);
			throw new ORPCError("INTERNAL_SERVER_ERROR");
		}
	}

	async findById(id: number): Promise<TestData> {
		try {
			const results = await db
				.select()
				.from(testData)
				.where(eq(testData.id, id));

			if (!results[0]) {
				throw new ORPCError("NOT_FOUND");
			}

			return results[0];
		} catch (error) {
			if (error instanceof ORPCError) {
				throw error;
			}
			console.error(error);
			throw new ORPCError("INTERNAL_SERVER_ERROR");
		}
	}

	async create(data: TestInput): Promise<void> {
		try {
			const insertData: TestDataInsert = {
				...data,
				startAt: null,
				endAt: null,
				status: "pending",
			};
			await db.insert(testData).values(insertData);
		} catch (error) {
			console.error(error);
			throw new ORPCError("INTERNAL_SERVER_ERROR");
		}
	}

	async delete(id: number): Promise<void> {
		try {
			await db.delete(testData).where(eq(testData.id, id));
		} catch (error) {
			console.error(error);
			throw new ORPCError("INTERNAL_SERVER_ERROR");
		}
	}
}
