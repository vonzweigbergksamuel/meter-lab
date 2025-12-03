import "dotenv/config";
import { eq } from "drizzle-orm";
import { db } from "../services/db/index.js";
import { user } from "../services/db/schema/auth-schema.js";
import { auth } from "../utils/auth.js";

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
			.update(user)
			.set({ role: "admin" })
			.where(eq(user.id, result.user.id));

		console.log("Admin user created successfully!");
	} catch (error) {
		console.error("Error creating admin user:", error);
	}
}

seedAdmin();
