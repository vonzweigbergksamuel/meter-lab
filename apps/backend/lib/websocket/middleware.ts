import type { IncomingMessage } from "node:http";
import { ORPCError, os } from "@orpc/server";
import { type JWTPayload, verifyJWT } from "../utils/jwt-verify.js";

export interface BaseContext {
	request: IncomingMessage;
}
export interface ProtectedContext extends BaseContext {
	user: JWTPayload;
}
export const publicProcedure = os.$context<BaseContext>();

const websocketProcedure = publicProcedure.middleware(
	async ({ context, next }) => {
		const cookies = context.request.headers.cookie?.split(";");

		const cookie = cookies?.filter((cookie) =>
			cookie.trim().startsWith("jwt="),
		);

		if (!cookie) {
			throw new ORPCError("UNAUTHORIZED");
		}

		// Get the token
		const token = cookie[0].split("=")[1];

		try {
			const user = await verifyJWT(`Bearer ${token}`);
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

export const protectedWsProcedure = publicProcedure.use(websocketProcedure);
