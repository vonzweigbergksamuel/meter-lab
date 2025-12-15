import { ORPCError, os } from "@orpc/server";
import { env } from "../env.js";
import { type JWTPayload, verifyJWT } from "../utils/jwt-verify.js";
export interface BaseContext {
	request: Request;
}
export interface ProtectedContext extends BaseContext {
	user: JWTPayload;
}
export const publicProcedure = os.$context<BaseContext>();
const jwtAuthMiddleware = publicProcedure.middleware(
	async ({ context, next }) => {
		const authHeader = context.request.headers.get("Authorization");
		if (!authHeader) {
			throw new ORPCError("UNAUTHORIZED", {
				message: "Unauthorized",
			});
		}
		try {
			const user = await verifyJWT(authHeader);
			console.warn("user", user);
			return next({
				context: {
					...context,
					user,
				},
			});
		} catch (error) {
			throw new ORPCError("UNAUTHORIZED", {
				message: error instanceof Error ? error.message : "Unauthorized",
			});
		}
	},
);
const basicAuthMiddleware = publicProcedure.middleware(
	async ({ context, next }) => {
		const authHeader = context.request.headers.get("Authorization");
		if (!authHeader) {
			throw new ORPCError("UNAUTHORIZED", {
				message: "Unauthorized",
			});
		}
		try {
			const [username, password] = Buffer.from(
				authHeader.split(" ")[1],
				"base64",
			)
				.toString()
				.split(":");

			if (
				username !== env.TEST_RUNNER_USERNAME ||
				password !== env.TEST_RUNNER_PASSWORD
			) {
				throw new ORPCError("UNAUTHORIZED", {
					message: "Unauthorized",
				});
			}
			return next({ context });
		} catch (error) {
			throw new ORPCError("UNAUTHORIZED", {
				message: error instanceof Error ? error.message : "Unauthorized",
			});
		}
	},
);

export const protectedProcedure = publicProcedure.use(jwtAuthMiddleware);
export const basicAuthProcedure = publicProcedure.use(basicAuthMiddleware);
