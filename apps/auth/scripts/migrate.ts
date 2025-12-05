import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import * as schema from "../services/db/schema/auth-schema.js";

async function main() {
	try {
		const db = drizzle({
			connection: {
				connectionString: process.env.DATABASE_URL,
			},
			schema,
		});

		await migrate(db, {
			migrationsFolder: "./services/db/migrations",
		});

		console.log("Migrations completed successfully");
	} catch (error) {
		console.error("Migration failed:", error);
		throw error;
	}
}

main();
