import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";

export async function migrateBackend() {
	const databaseUrl = process.env.BACKEND_DATABASE_URL;

	if (!databaseUrl) {
		throw new Error("BACKEND_DATABASE_URL environment variable is required");
	}

	console.log("Starting backend database migrations...");

	try {
		const db = drizzle({
			connection: { connectionString: databaseUrl },
		});

		await migrate(db, {
			migrationsFolder: "./migrations/backend",
		});

		console.log("Backend migrations completed successfully\n");
	} catch (error) {
		console.error("Backend migration failed:", error);
		throw error;
	}
}

if (import.meta.url === `file://${process.argv[1]}`) {
	migrateBackend()
		.then(() => process.exit(0))
		.catch(() => process.exit(1));
}
