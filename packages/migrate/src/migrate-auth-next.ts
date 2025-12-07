import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

export async function migrateAuthNext() {
	const host = process.env.AUTH_NEXT_DATABASE_HOST;
	const port = process.env.AUTH_NEXT_DATABASE_PORT;
	const user = process.env.AUTH_NEXT_DATABASE_USER;
	const password = process.env.AUTH_NEXT_DATABASE_PASSWORD;
	const database = process.env.AUTH_NEXT_DATABASE_NAME;

	if (!host || !port || !user || !password || !database) {
		throw new Error(
			"AUTH_NEXT_DATABASE_HOST, AUTH_NEXT_DATABASE_PORT, AUTH_NEXT_DATABASE_USER, AUTH_NEXT_DATABASE_PASSWORD, and AUTH_NEXT_DATABASE_NAME environment variables are required",
		);
	}

	console.log("Starting auth-next database migrations...");

	try {
		const pool = new Pool({
			host,
			port: Number.parseInt(port, 10),
			user,
			password,
			database,
			ssl: false,
		});

		const db = drizzle({ client: pool });

		await migrate(db, {
			migrationsFolder: "./migrations/auth-next",
		});

		await pool.end();

		console.log("Auth-next migrations completed successfully\n");
	} catch (error) {
		console.error("Auth-next migration failed:", error);
		throw error;
	}
}

if (import.meta.url === `file://${process.argv[1]}`) {
	migrateAuthNext()
		.then(() => process.exit(0))
		.catch(() => process.exit(1));
}
