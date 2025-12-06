import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { schema } from "@/lib/db/schema";

async function main() {
	try {
		const db = drizzle({
			connection: {
				connectionString: process.env.DATABASE_URL,
			},
			schema,
		});

		await migrate(db, {
			migrationsFolder: "./lib/db/migrations",
		});

		console.log("Migrations completed successfully");
	} catch (error) {
		console.error("Migration failed:", error);
		throw error;
	}
}

main();
