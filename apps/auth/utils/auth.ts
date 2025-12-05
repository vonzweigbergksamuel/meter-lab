import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, jwt } from "better-auth/plugins";
import { db } from "../services/db/index.js";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
	}),
	plugins: [jwt(), admin()],
	trustedOrigins: [
		"http://localhost:5173", // Web
		"http://localhost:5080", // Web
		"http://localhost:3000", // Backend
		"http://localhost:5070", // Backend
		"http://blade.jemac.se", // Production
		"http://34.51.237.11", // Stage Auth
		"http://34.51.192.219", // Stage Web/Backend
	],
	emailAndPassword: {
		enabled: true,
	},
});

export type AuthType = {
	user: typeof auth.$Infer.Session.user | null;
	session: typeof auth.$Infer.Session.session | null;
};
