import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

export async function migrateBackend() {
	const host = process.env.BACKEND_DATABASE_HOST;
	const port = process.env.BACKEND_DATABASE_PORT;
	const user = process.env.BACKEND_DATABASE_USER;
	const password = process.env.BACKEND_DATABASE_PASSWORD;
	const database = process.env.BACKEND_DATABASE_NAME;

	if (!host || !port || !user || !password || !database) {
		throw new Error(
			"BACKEND_DATABASE_HOST, BACKEND_DATABASE_PORT, BACKEND_DATABASE_USER, BACKEND_DATABASE_PASSWORD, and BACKEND_DATABASE_NAME environment variables are required",
		);
	}

	console.log("Starting backend database migrations...");

	let pool: Pool | undefined;

	try {
		pool = new Pool({
			host,
			port: Number.parseInt(port, 10),
			user,
			password,
			database,
			ssl: false,
		});

		const db = drizzle({ client: pool });

		await migrate(db, {
			migrationsFolder: "./migrations/backend",
		});

		await pool.end();

		console.log("Backend migrations completed successfully\n");
	} catch (error: any) {
		if (pool) {
			await pool.end();
		}

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
