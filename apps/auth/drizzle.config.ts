import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
	out: "./services/db/migrations",
	schema: "./services/db/schemas",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL || "",
	},
});
