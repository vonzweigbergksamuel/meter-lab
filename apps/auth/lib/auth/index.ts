import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin, jwt, openAPI } from "better-auth/plugins";
import { db } from "@/lib/db";
import { env } from "../env/server";

export const allowedOrigins = new Set([
	/* ----- Web ----- */
	"http://localhost:5173", // Local
	"http://localhost:5080", // Local docker
	"https://nordicode.se", // Stage
	"http://blade.jemac.se:5080", // Prod

	/* ----- Backend ----- */
	"http://localhost:3000", // Local
	"http://localhost:5070", // Local docker
	"https://api.nordicode.se", // Stage
	"http://blade.jemac.se:5070", // Prod

	/* ----- Auth ----- */
	"http://localhost:5090", // Local
	"https://auth.nordicode.se", // Stage
	"http://blade.jemac.se:5090", // Prod
]);

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
	}),
	advanced: {
		defaultCookieAttributes: {
			secure: true,
			httpOnly: true,
			sameSite: "lax",
		},
		crossSubDomainCookies: {
			enabled: true,
			domain: env.DOMAIN,
		},
	},
	plugins: [
		jwt({
			jwt: {
				issuer: env.PUBLIC_AUTH_URL,
				audience: env.PUBLIC_AUTH_URL,
			},
		}),
		admin(),
		openAPI(),
		nextCookies(),
	],
	trustedOrigins: [...allowedOrigins],
	emailAndPassword: {
		enabled: true,
	},
});

export type AuthType = {
	user: typeof auth.$Infer.Session.user | null;
	session: typeof auth.$Infer.Session.session | null;
};
