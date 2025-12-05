import { Hono } from "hono";
import { type AuthType, auth } from "../../utils/auth.js";
import { CreateUserForm } from "../components/create-user-form.js";
import { LoginForm } from "../components/login-form.js";
import type { User } from "../components/types.js";
import { UnauthorizedPage } from "../components/unauthorized-page.js";
import { UserList } from "../components/user-list.js";

const router = new Hono<{ Bindings: AuthType }>({
	strict: false,
});

router.get("/admin", async (c) => {
	const session = await auth.api.getSession({
		headers: c.req.raw.headers,
	});

	const userRole = session?.user ? (session.user as User).role : null;

	if (!session?.user || userRole !== "admin") {
		return c.html(<UnauthorizedPage />, 401);
	}

	const users = await auth.api.listUsers({
		query: {},
		headers: c.req.raw.headers,
	});

	return c.html(
		<UserList
			users={(users.users || []) as User[]}
			currentUser={session.user as User}
		/>,
	);
});

router.get("/admin/login", (c) => {
	return c.html(<LoginForm />);
});

router.post("/admin/login", async (c) => {
	const body = await c.req.parseBody<{ email: string; password: string }>();

	try {
		const loginResponse = await auth.api.signInEmail({
			body: {
				email: body.email,
				password: body.password,
			},
			asResponse: true,
		});

		if (!loginResponse.ok) {
			return c.html(<LoginForm error="Invalid email or password" />);
		}

		const headers = new Headers();
		headers.set("Location", "/admin");
		loginResponse.headers.forEach((value, key) => {
			if (key.toLowerCase() === "set-cookie") {
				headers.append(key, value);
			}
		});

		return new Response(null, { status: 302, headers });
	} catch (error) {
		console.error("Login error:", error);
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

router.post("/admin/api/users/:id/password", async (c) => {
	const session = await auth.api.getSession({
		headers: c.req.raw.headers,
	});

	if (!session?.user || session.user.role !== "admin") {
		return c.json({ error: "Unauthorized" }, 401);
	}

	const userId = c.req.param("id");
	const body = await c.req.parseBody();
	const newPassword = body.newPassword as string;

	if (!newPassword || newPassword.length < 8) {
		return c.json({ error: "Password must be at least 8 characters" }, 400);
	}

	await auth.api.setUserPassword({
		body: {
			userId,
			newPassword,
		},
		headers: c.req.raw.headers,
	});

	return c.redirect("/admin");
});

router.post("/admin/api/users/:id/delete", async (c) => {
	const session = await auth.api.getSession({
		headers: c.req.raw.headers,
	});

	if (!session?.user || session.user.role !== "admin") {
		return c.json({ error: "Unauthorized" }, 401);
	}

	const userId = c.req.param("id");

	if (userId === session.user.id) {
		return c.json({ error: "Cannot delete your own account" }, 400);
	}

	await auth.api.removeUser({
		body: { userId },
		headers: c.req.raw.headers,
	});

	return c.redirect("/admin");
});

router.post("/admin/api/logout", async (c) => {
	const response = await auth.api.signOut({
		headers: c.req.raw.headers,
		asResponse: true,
	});

	const headers = new Headers(response.headers);
	headers.set("Location", "/admin/login");

	return new Response(null, {
		status: 302,
		headers,
	});
});

export default router;
