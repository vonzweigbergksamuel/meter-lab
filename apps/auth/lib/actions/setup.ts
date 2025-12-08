"use server";

import { eq } from "drizzle-orm";
import { auth } from "../auth";
import { db } from "../db";
import { schema } from "../db/schema";

export async function checkAdminExists(): Promise<boolean> {
	try {
		const adminUser = await db.query.user.findFirst({
			where: eq(schema.user.role, "admin"),
		});

		const exists = !!adminUser;
		console.log("[checkAdminExists] Admin exists:", exists);
		return exists;
	} catch (error) {
		console.error("[checkAdminExists] Error:", error);
		return false;
	}
}

export async function createFirstAdmin(data: {
	email: string;
	password: string;
	name: string;
}): Promise<{ success: boolean; error?: string; shouldSignIn?: boolean }> {
	try {
		const hasAdmin = await checkAdminExists();
		if (hasAdmin) {
			return { success: false, error: "Admin user already exists" };
		}

		const result = await auth.api.signUpEmail({
			body: {
				email: data.email,
				password: data.password,
				name: data.name,
			},
		});

		if (!result?.user) {
			return { success: false, error: "Failed to create user" };
		}

		await db
			.update(schema.user)
			.set({ role: "admin" })
			.where(eq(schema.user.id, result.user.id));

		return { success: true, shouldSignIn: true };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
		};
	}
}
