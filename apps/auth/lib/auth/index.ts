import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin, jwt, openAPI } from "better-auth/plugins";
import { db } from "@/lib/db";

export const allowedOrigins = new Set([
	/* ----- Web ----- */
	"http://localhost:5173",
	"http://localhost:5080",
	"http://34.51.237.11",
	"http://blade.jemac.se:5080",

	/* ----- Backend ----- */
	"http://localhost:3000",
	"http://localhost:5070",
	"http://34.51.192.219",
	"http://blade.jemac.se:5070",
]);

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
	}),
	advanced: {
		defaultCookieAttributes: {
			// secure: env.NODE_ENV !== "development",
			// httpOnly: env.NODE_ENV !== "development",
			secure: false,
			httpOnly: false,
			sameSite: "none",
			partitioned: true,
		},
	},
	plugins: [jwt(), admin(), openAPI(), nextCookies()], // Make sure that nextCookies is the last plugin in the array
	trustedOrigins: [...allowedOrigins],
	emailAndPassword: {
		enabled: true,
	},
});

export type AuthType = {
	user: typeof auth.$Infer.Session.user | null;
	session: typeof auth.$Infer.Session.session | null;
};
