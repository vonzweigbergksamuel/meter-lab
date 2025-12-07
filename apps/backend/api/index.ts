import { os } from "@orpc/server";
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
		return next({
			context: {
				...context,
				user,
			},
		});
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : "Unauthorized");
	}
});

export const protectedProcedure = publicProcedure.use(authMiddleware);
