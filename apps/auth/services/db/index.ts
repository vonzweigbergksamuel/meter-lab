import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "../../env.js";
import * as schema from "./schema/auth-schema.js";

export const db = drizzle({
	connection: {
		connectionString: env.DATABASE_URL,
	},
	schema,
});
