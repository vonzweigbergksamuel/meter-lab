import { ORPCError } from "@orpc/client";
import { and, desc, eq, lt } from "drizzle-orm";
import { db } from "../../../lib/db/index.js";
import {
	type TestData,
	type TestDataInsert,
	testData,
} from "../../../lib/db/schema/schema.js";
import type { TestDB } from "./interface.js";
import type { Filter, TestInput, TestUpdate } from "./types.js";

export class TestDBService implements TestDB {
	async findAll(filter?: Filter): Promise<TestData[]> {
		try {
			const conditions = [];

			if (filter?.testType) {
				conditions.push(eq(testData.testType, filter.testType));
			}

			if (filter?.endAt) {
				conditions.push(lt(testData.endAt, filter.endAt));
			}

			const baseQuery = db.select().from(testData);
			const results =
				conditions.length > 0
					? await baseQuery.where(and(...conditions)).orderBy(desc(testData.id))
					: await baseQuery.orderBy(desc(testData.id));

			if (filter?.limit) {
				return results.slice(0, filter.limit);
			}

			return results;
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

	async create(data: TestInput): Promise<TestData> {
		try {
			const insertData: TestDataInsert = {
				...data,
				startAt: null,
				endAt: null,
				status: "pending",
			};
			const [result] = await db.insert(testData).values(insertData).returning();

			return result;
		} catch (error) {
			console.error(error);
			throw new ORPCError("INTERNAL_SERVER_ERROR");
		}
	}

	async update(id: number, data: TestUpdate): Promise<TestData> {
		try {
			const [result] = await db
				.update(testData)
				.set(data)
				.where(eq(testData.id, id))
				.returning();

			if (!result) {
				throw new ORPCError("NOT_FOUND");
			}

			return result;
		} catch (error) {
			if (error instanceof ORPCError) {
				throw error;
			}
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
