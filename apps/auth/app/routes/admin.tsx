import { Hono } from "hono";
import { type AuthType, auth } from "../../utils/auth.js";
import { CreateUserForm } from "../components/create-user-form.js";
import { LoginForm } from "../components/login-form.js";
import { UnauthorizedPage } from "../components/unauthorized-page.js";
import { UserList } from "../components/user-list.js";

const router = new Hono<{ Bindings: AuthType }>({
	strict: false,
});

interface User {
	id: string;
	name: string;
	email: string;
	role?: string | null;
	banned?: boolean | null;
}

router.get("/admin", async (c) => {
	const session = await auth.api.getSession({
		headers: c.req.raw.headers,
	});

	// Check if user is authenticated and has admin role
	const userRole = session?.user ? (session.user as User).role : null;

	if (!session?.user || userRole !== "admin") {
		return c.html(<UnauthorizedPage />, 401);
	}

	const users = await auth.api.listUsers({
		query: {},
		headers: c.req.raw.headers,
	});

	return c.html(<UserList users={(users.users || []) as User[]} />);
});

router.get("/admin/login", (c) => {
	return c.html(<LoginForm />);
});

router.post("/admin/login", async (c) => {
	const body = await c.req.parseBody<{ email: string; password: string }>();

	try {
		const result = await auth.api.signInEmail({
			body: {
				email: body.email,
				password: body.password,
			},
			asResponse: true,
		});

		return result;
	} catch {
		return c.html(<LoginForm error="Invalid email or password" />);
	}
});

router.get("/admin/create", async (c) => {
	const session = await auth.api.getSession({
		headers: c.req.raw.headers,
	});

	if (!session?.user || session.user.role !== "admin") {
		return c.redirect("/admin");
	}

	return c.html(<CreateUserForm />);
});

router.post("/admin/api/users", async (c) => {
	const session = await auth.api.getSession({
		headers: c.req.raw.headers,
	});

	if (!session?.user || session.user.role !== "admin") {
		return c.json({ error: "Unauthorized" }, 401);
	}

	const body = await c.req.parseBody();
	const role = body.role as string;

	const result = await auth.api.createUser({
		body: {
			name: body.name as string,
			email: body.email as string,
			password: body.password as string,
			role: role === "admin" || role === "user" ? role : "user",
		},
		headers: c.req.raw.headers,
	});

	if (result) {
		return c.redirect("/admin");
	}

	return c.json({ error: "Failed to create user" }, 400);
});

router.post("/admin/api/users/:id/role", async (c) => {
	const session = await auth.api.getSession({
		headers: c.req.raw.headers,
	});

	if (!session?.user || session.user.role !== "admin") {
		return c.json({ error: "Unauthorized" }, 401);
	}

	const userId = c.req.param("id");
	const body = await c.req.parseBody();
	const role = body.role as string;

	await auth.api.setRole({
		body: {
			userId,
			role: role === "admin" || role === "user" ? role : "user",
		},
		headers: c.req.raw.headers,
	});

	return c.redirect("/admin");
});

export default router;
