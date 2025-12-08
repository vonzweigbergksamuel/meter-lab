import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "../env.js";

export const db = drizzle({
	connection: {
		connectionString: env.DATABASE_URL,
	},
	// schema,
});
