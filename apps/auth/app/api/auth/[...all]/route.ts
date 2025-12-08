import { toNextJsHandler } from "better-auth/next-js";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

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

type Handler =
	| ReturnType<typeof toNextJsHandler>["GET"]
	| ReturnType<typeof toNextJsHandler>["POST"];

function withCors(handler: Handler) {
	return async (req: NextRequest) => {
		const origin = req.headers.get("origin");
		const headers: Record<string, string> = {
			"Access-Control-Allow-Methods": "GET,POST,OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type, Authorization",
			"Access-Control-Allow-Credentials": "true",
		};
		if (origin && allowedOrigins.has(origin)) {
			headers["Access-Control-Allow-Origin"] = origin;
		}
		if (req.method === "OPTIONS") {
			return new Response(null, { status: 204, headers });
		}
		const res = await handler(req);
		const entries = Object.entries(headers);
		for (const [k, v] of entries) {
			res.headers.set(k, v);
		}

		return res;
	};
}

const handler = toNextJsHandler(auth);
export const GET = withCors(handler.GET);
export const POST = withCors(handler.POST);
export const OPTIONS = withCors(
	async () => new Response(null, { status: 204 }),
);
