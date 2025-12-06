import { redirect } from '@sveltejs/kit';

export const handle = async ({ event, resolve }) => {
	const pathname = event.url.pathname;
	const publicPaths = ["/login", "/logout"];

	const isPublicRoute = publicPaths.some((path) => {
		return pathname === path || pathname.startsWith(path);
	});
	console.log("isPublicRoute", isPublicRoute);

	// Get user session
	const session = event.cookies.get("better-auth.session_token")
	const jwtCookie = event.cookies.get("better-auth.jwt_token")

	// if session exist but not a jwt cookie => Create
	if (session && !jwtCookie) {
		// TODO Samuel & Ludwig
		// Fetch JWT HERE
		const jwtValue = ""
		event.cookies.set("better-auth.jwt_token", jwtValue, {
			path: '/',
			httpOnly: true,
			maxAge: 60 * 60 * 24
		})
	} else if (!session && jwtCookie) {
		event.cookies.delete("better-auth.jwt_token", {
			path: '/'
		})
	}

	// if no sesseion exist but a jwt cookie exist => remove

	// set user to session
	event.locals.session = session
	// event.locals.session = sessionTest.data

	if (!session && !isPublicRoute) {
			return redirect(302, "/login");
	}

	if (session && isPublicRoute) {
			return redirect(302, "/dashboard");
	}

	return resolve(event);
};
