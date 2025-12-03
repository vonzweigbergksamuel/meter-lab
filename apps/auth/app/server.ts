import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { env } from "../env.js";
import { type AuthType, auth } from "../utils/auth.js";
import admin from "./routes/admin.js";
import authRoutes from "./routes/auth.js";

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
			"http://localhost:5070",
			"http://localhost:5080",
			"http://localhost:5173",
			"http://localhost:3000",
			"http://blade.jemac.se",
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

// Auth middleware to protect admin routes
app.use("/admin/*", async (c, next) => {
	if (c.req.path === "/admin/login") {
		return next();
	}

	const session = await auth.api.getSession({ headers: c.req.raw.headers });

	if (!session || session.user?.role !== "admin") {
		return c.redirect("/admin/login");
	}

	await next();
});

// Define API routes
const routes = [authRoutes] as const;
routes.forEach((route) => {
	app.basePath("/api").route("/", route);
});

// Mount admin routes
app.route("/", admin);

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
