/** biome-ignore-all lint/style/noNonNullAssertion: Process needs to be used */
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
	out: "./db/migrations",
	schema: "./db/schema",
	dialect: "postgresql",
	dbCredentials: {
		host: process.env.DATABASE_HOST!,
		port: parseInt(process.env.DATABASE_PORT!, 10),
		user: process.env.DATABASE_USER!,
		password: process.env.DATABASE_PASSWORD!,
		database: process.env.DATABASE_NAME!,
		ssl: false,
	},
});
