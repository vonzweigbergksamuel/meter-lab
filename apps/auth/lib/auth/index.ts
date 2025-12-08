import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin, jwt, openAPI } from "better-auth/plugins";
import { allowedOrigins } from "@/app/api/auth/[...all]/route";
import { db } from "@/lib/db";

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
