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
		if (!context.request?.headers) {
			throw new ORPCError("UNAUTHORIZED", {
				message: "Request headers not found",
			});
		}

		const cookieHeader = context.request.headers.cookie;
		if (!cookieHeader) {
			throw new ORPCError("UNAUTHORIZED", {
				message: "No cookie header found",
			});
		}

		const cookies = cookieHeader.split(";");

		const cookie = cookies.filter((cookie) => cookie.trim().startsWith("jwt="));

		if (!cookie || cookie.length === 0) {
			throw new ORPCError("UNAUTHORIZED", {
				message: "No JWT cookie found",
			});
		}

		const jwtCookie = cookie[0].trim();
		if (!jwtCookie.includes("=")) {
			throw new ORPCError("UNAUTHORIZED", {
				message: "Invalid JWT cookie format",
			});
		}

		const token = jwtCookie.split("=")[1];

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
