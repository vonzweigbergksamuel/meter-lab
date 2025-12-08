import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";

async function main() {
	try {
		console.log("Migrating database...");

		const db = drizzle({
			connection: {
				connectionString: process.env.DATABASE_URL,
			},
		});

		await migrate(db, {
			migrationsFolder: "./db/migrations",
		});

		console.log("Migrations completed successfully");
	} catch (error) {
		console.error("Migration failed:", error);
		throw error;
	}
}

await main();
