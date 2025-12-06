import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, jwt, openAPI } from "better-auth/plugins";
import { db } from "@/services/db/index.js";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
	}),
	plugins: [jwt(), admin(), openAPI()],
	trustedOrigins: [
		/* ----- Web ----- */
		"http://localhost:5173", // Local
		"http://34.51.237.11", // Stage
		"http://blade.jemac.se:5080", // Prod

		/* ----- Backend ----- */
		"http://localhost:3000", // Local
		"http://34.51.192.219", // Stage
		"http://blade.jemac.se:5070", // Prod
	],
	emailAndPassword: {
		enabled: true,
	},
});

export type AuthType = {
	user: typeof auth.$Infer.Session.user | null;
	session: typeof auth.$Infer.Session.session | null;
};
