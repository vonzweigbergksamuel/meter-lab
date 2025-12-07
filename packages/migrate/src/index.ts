import { migrateAuth } from "./migrate-auth.js";
import { migrateBackend } from "./migrate-backend.js";

async function validateEnvironment() {
	console.log("Validating environment variables...\n");

	const errors: string[] = [];

	if (!process.env.BACKEND_DATABASE_URL) {
		errors.push("- BACKEND_DATABASE_URL is missing");
	}

	if (!process.env.AUTH_DATABASE_HOST) {
		errors.push("- AUTH_DATABASE_HOST is missing");
	}
	if (!process.env.AUTH_DATABASE_PORT) {
		errors.push("- AUTH_DATABASE_PORT is missing");
	}
	if (!process.env.AUTH_DATABASE_USER) {
		errors.push("- AUTH_DATABASE_USER is missing");
	}
	if (!process.env.AUTH_DATABASE_PASSWORD) {
		errors.push("- AUTH_DATABASE_PASSWORD is missing");
	}
	if (!process.env.AUTH_DATABASE_NAME) {
		errors.push("- AUTH_DATABASE_NAME is missing");
	}

	if (errors.length > 0) {
		console.error("Environment validation failed:\n");
		for (const error of errors) {
			console.error(error);
		}
		throw new Error("Missing required environment variables");
	}

	console.log("All required environment variables are present\n");
}

async function main() {
	console.log("Starting database migrations for all services...\n");
	console.log("=".repeat(60));
	console.log("\n");

	try {
		await validateEnvironment();

		await migrateBackend();
		await migrateAuth();

		console.log("=".repeat(60));
		console.log("All migrations completed successfully!");
		console.log("=".repeat(60));
	} catch (error) {
		console.error(`\n${"=".repeat(60)}`);
		console.error("Migration process failed!");
		console.error("=".repeat(60));
		console.error(error);
		process.exit(1);
	}
}

main();
