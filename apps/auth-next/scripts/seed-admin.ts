import "dotenv/config";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/services/db";
import { schema } from "@/services/db/schema";

async function seedAdmin() {
	try {
		const result = await auth.api.signUpEmail({
			body: {
				email: process.env.ADMIN_EMAIL || "admin@example.com",
				password: process.env.ADMIN_PASSWORD || "changeme123",
				name: process.env.ADMIN_NAME || "Admin User",
			},
		});

		if (!result?.user) {
			throw new Error("Failed to create user");
		}

		await db
			.update(schema.user)
			.set({ role: "admin" })
			.where(eq(schema.user.id, result.user.id));

		console.log("Admin user created successfully!");
	} catch (error) {
		console.error("Error creating admin user:", error);
	}
}

seedAdmin();
