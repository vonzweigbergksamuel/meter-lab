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
	} catch (error: any) {
		const isAlreadyExists =
			error?.code === "42P07" ||
			error?.cause?.code === "42P07" ||
			error?.message?.includes("already exists") ||
			error?.cause?.message?.includes("already exists");

		if (isAlreadyExists) {
			console.log("Backend migrations already applied (tables exist)\n");
		} else {
			console.error("Backend migration failed:", error);
			throw error;
		}
	}
}

if (import.meta.url === `file://${process.argv[1]}`) {
	migrateBackend()
		.then(() => process.exit(0))
		.catch(() => process.exit(1));
}
