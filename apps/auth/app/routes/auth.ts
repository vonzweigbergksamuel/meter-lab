import { Hono } from "hono";
import { type AuthType, auth } from "../../utils/auth.js";

const router = new Hono<{ Bindings: AuthType }>({
	strict: false,
});

router.on(["POST", "GET", "OPTIONS"], "/auth/*", (c) => {
	return auth.handler(c.req.raw);
});

export default router;
