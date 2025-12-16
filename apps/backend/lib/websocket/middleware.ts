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
		let token: string | null = null;

		const cookies = context.request.headers.cookie?.split(";");
		const cookie = cookies?.filter((cookie) =>
			cookie.trim().startsWith("jwt="),
		);

		if (cookie && cookie.length > 0) {
			token = cookie[0].split("=")[1];
		}

		if (!token && context.request.url) {
			const urlString = context.request.url.startsWith("http")
				? context.request.url
				: `http://localhost${context.request.url}`;
			try {
				const url = new URL(urlString);
				token = url.searchParams.get("token");
			} catch {
				const match = context.request.url.match(/[?&]token=([^&]+)/);
				if (match) {
					token = decodeURIComponent(match[1]);
				}
			}
		}

		if (!token) {
			throw new ORPCError("UNAUTHORIZED", {
				message: "No JWT cookie found",
			});
		}

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
