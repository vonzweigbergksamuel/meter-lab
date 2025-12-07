import path from "node:path";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { client } from ".";

async function run() {
	try {
		console.log("Running migrations...");
		await migrate(drizzle(client), {
			migrationsFolder: path.join(process.cwd(), "lib/db/migrations"),
		});
		console.log("Migrations completed successfully");
		// biome-ignore lint/suspicious/noExplicitAny: error is unknown
	} catch (error: any) {
		if (error?.cause?.code === "42P07") {
			console.log("Migrations already applied, skipping...");
		} else {
			console.error("Migration error:", error);
		}
	}
}

run();
