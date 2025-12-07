import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";

export async function migrateAuth() {
	const databaseUrl = process.env.AUTH_DATABASE_URL;

	if (!databaseUrl) {
		throw new Error("AUTH_DATABASE_URL environment variable is required");
	}

	console.log("Starting auth database migrations...");

	try {
		const db = drizzle({
			connection: { connectionString: databaseUrl },
		});

		await migrate(db, {
			migrationsFolder: "./migrations/auth",
		});

		console.log("Auth migrations completed successfully\n");
	} catch (error) {
		console.error("Auth migration failed:", error);
		throw error;
	}
}

if (import.meta.url === `file://${process.argv[1]}`) {
	migrateAuth()
		.then(() => process.exit(0))
		.catch(() => process.exit(1));
}
