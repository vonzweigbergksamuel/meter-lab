import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { env } from "../env.js";
import type { AuthType } from "../utils/auth.js";
import auth from "./routes/auth.js";

const app = new Hono<{
	Variables: AuthType;
}>({
	strict: false,
});

// CORS middleware
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

// Logger middleware
app.use(logger());

// Define API routes
const routes = [auth] as const;
routes.forEach((route) => {
	app.basePath("/api").route("/", route);
});

// Health check
app.get("/", (c) => {
	return c.json({
		message: "OK",
		timestamp: Date.now(),
	});
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
