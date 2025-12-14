import { ORPCError, os } from "@orpc/server";
import { getKeyValueStoreService } from "../di/helpers.js";
import { type JWTPayload, verifyJWT } from "../utils/jwt-verify.js";

export interface BaseContext {
	request: Request;
}

export interface ProtectedContext extends BaseContext {
	user: JWTPayload;
}

export const publicProcedure = os.$context<BaseContext>();

const authMiddleware = publicProcedure.middleware(async ({ context, next }) => {
	const authHeader = context.request.headers.get("Authorization");

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
});

const tokenAuthMiddleware = publicProcedure.middleware(
	async ({ context, next }) => {
		const authHeader = context.request.headers.get("meter-lab-api-key");

		if (!authHeader) {
			throw new ORPCError("BAD_REQUEST", {
				message: "meter-lab-api-key header is required",
			});
		}

		const validToken = await getKeyValueStoreService().get(authHeader);

		if (!validToken) {
			throw new ORPCError("UNAUTHORIZED", {
				message: "Not valid Token",
			});
		}

		return next({
			context: {
				...context,
				token: validToken,
			},
		});
	},
);

export const protectedProcedure = publicProcedure.use(authMiddleware);
export const tokenProtectedProcedure = publicProcedure.use(tokenAuthMiddleware);
