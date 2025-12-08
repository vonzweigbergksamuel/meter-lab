import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

export async function migrateAuth() {
	const host = process.env.AUTH_DATABASE_HOST;
	const port = process.env.AUTH_DATABASE_PORT;
	const user = process.env.AUTH_DATABASE_USER;
	const password = process.env.AUTH_DATABASE_PASSWORD;
	const database = process.env.AUTH_DATABASE_NAME;

	if (!host || !port || !user || !password || !database) {
		throw new Error(
			"AUTH_DATABASE_HOST, AUTH_DATABASE_PORT, AUTH_DATABASE_USER, AUTH_DATABASE_PASSWORD, and AUTH_DATABASE_NAME environment variables are required",
		);
	}

	console.log("Starting auth database migrations...");

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
			migrationsFolder: "./migrations/auth",
		});

		await pool.end();

		console.log("Auth migrations completed successfully\n");
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
			console.log("Auth migrations already applied (tables exist)\n");
		} else {
			console.error("Auth migration failed:", error);
			throw error;
		}
	}
}

if (import.meta.url === `file://${process.argv[1]}`) {
	migrateAuth()
		.then(() => process.exit(0))
		.catch(() => process.exit(1));
}
