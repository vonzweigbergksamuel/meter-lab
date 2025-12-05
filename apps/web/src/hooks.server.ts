import { authClient } from '@/auth-client';
import { redirect } from '@sveltejs/kit';

export const handle = async ({ event, resolve }) => {
	const pathname = event.url.pathname;
	const publicPaths = ["/login", "/logout"];

	const isPublicRoute = publicPaths.some((path) => {
		return pathname === path || pathname.startsWith(path);
	});
    console.log("isPublicRoute", isPublicRoute);

	const { data: session } = await authClient.getSession({
		fetchOptions: {
			headers: event.request.headers,
		},
	});
	event.locals.session = session;
	console.log("isSession: ", session)

    if (!session && !isPublicRoute) {
        return redirect(302, "/login");
    }

    if (session && isPublicRoute) {
        return redirect(302, "/");
    }

    return resolve(event);
};
