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

console.log(env.ENVIROMENT)
console.log(env.ENVIROMENT === "stage" ? "nordicode.se" : "jemac.se");
console.log(env.ENVIROMENT === "stage" ? "http://auth:80" : "http://auth:5090");
console.log(env.ENVIROMENT === "stage" ? "http://auth:80" : "http://auth:5090");

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
			domain: env.ENVIROMENT === "stage" ? "nordicode.se" : "jemac.se",
		},
	},
	plugins: [
		jwt({
			jwt: {
				issuer:
					env.ENVIROMENT === "stage" ? "http://auth:80" : "http://auth:5090",
				audience:
					env.ENVIROMENT === "stage" ? "http://auth:80" : "http://auth:5090",
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
