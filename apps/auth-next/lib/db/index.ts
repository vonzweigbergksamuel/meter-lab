import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
// import { env } from "@/lib/env/server";
import { schema } from "./schema";

export const client = new Pool({
	host: process.env.DATABASE_HOST,
	port: parseInt(process.env.DATABASE_PORT!, 10),
	user: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASSWORD,
	database: process.env.DATABASE_NAME,
});

export const db = drizzle(client, { schema });
