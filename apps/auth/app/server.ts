import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { env } from "../env.js";
import { auth } from "../utils/auth.js";

const app = new Hono();

app.use(
	"*",
	cors({
		origin: [
			"http://localhost:5173",
			"http://localhost:5080",
			"http://localhost:3000",
			"http://localhost:5070",
		],
		allowHeaders: ["Content-Type", "Authorization"],
		allowMethods: ["POST", "GET", "OPTIONS"],
		exposeHeaders: ["Content-Length"],
		maxAge: 600,
		credentials: true,
	}),
);

app.get("/", (c) => {
	return c.text("Hello Auth!");
});

app.all("/api/auth/*", (c) => {
	return auth.handler(c.req.raw);
});

serve(
	{
		fetch: app.fetch,
		port: env.PORT,
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`);
	},
);
