import { eq } from "drizzle-orm";
import { auth } from "../auth";
import { db } from "./";
import { schema } from "./schema";

async function run() {
	try {
		const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";

		const existingAdmin = await db.query.user.findFirst({
			where: eq(schema.user.email, adminEmail),
		});

		if (existingAdmin) {
			console.log("Admin user already exists, skipping seed...");
			return;
		}

		const result = await auth.api.signUpEmail({
			body: {
				email: adminEmail,
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

run();
