import { redirect } from '@sveltejs/kit';

export const handle = async ({ event, resolve }) => {
	const pathname = event.url.pathname;
	const publicPaths = ["/login", "/logout"];

	const isPublicRoute = publicPaths.some((path) => {
		return pathname === path || pathname.startsWith(path);
	});
	console.log("isPublicRoute", isPublicRoute);

	console.log("Event: ", event.cookies.get("better-auth.session_token"))

	// Get user session
	const session = event.cookies.get("better-auth.session_token")

	// set user to session
	event.locals.session = session

	if (!session && !isPublicRoute) {
			return redirect(302, "/login");
	}

	if (session && isPublicRoute) {
			return redirect(302, "/");
	}

	return resolve(event);
};
