import { authClient } from '$lib/auth-client';
import { redirect } from '@sveltejs/kit';
import { decodeJwt } from 'jose';

export const handle = async ({ event, resolve }) => {
	const pathname = event.url.pathname;
	const publicPaths = ["/sign-in", "/logout"];

	const isPublicRoute = publicPaths.some((path) => {
		return pathname === path || pathname.startsWith(path);
	});

	if (isPublicRoute) {
		return resolve(event);
	}

	let { data: session } = await authClient.getSession({
		fetchOptions: {
			headers: event.request.headers,
		},
	});

	// Only in staging
	const isStaging = event.url.url.includes("34.51")
	if (isStaging) {
		session = event.cookies.get("better-auth.session_token")
	}

	if (!session) {
		return redirect(302, "/sign-in");
	}

	let jwt = event.cookies.get('jwt');
	let needsRefresh = false;

	if (jwt) {
		try {
			const decoded = decodeJwt(jwt);
			const now = Math.floor(Date.now() / 1000);
			const exp = decoded.exp || 0;
			
			if (exp < now + 60) {
				needsRefresh = true;
			}
		} catch (error) {
			console.error('Failed to decode JWT:', error);
			needsRefresh = true;
		}
	} else {
		needsRefresh = true;
	}

	if (needsRefresh) {
		try {
			const { data: tokenData, error: tokenError } = await authClient.token({
				fetchOptions: {
					headers: event.request.headers,
				},
			});

			if (tokenError) {
				console.error('Failed to get JWT token:', tokenError);
				return redirect(302, "/sign-in");
			}

			if (tokenData?.token) {
				jwt = tokenData.token;
				event.cookies.set('jwt', jwt, {
					httpOnly: true,
					secure: false,
					sameSite: 'lax',
					path: '/',
					maxAge: 60 * 15
				});
				event.cookies.set('jwt-client', jwt, {
					httpOnly: false,
					secure: false,
					sameSite: 'lax',
					path: '/',
					maxAge: 60 * 15
				});
			}
		} catch (error) {
			console.error('Error fetching JWT token:', error);
			return redirect(302, "/sign-in");
		}
	}

	event.locals.jwt = jwt;

	return resolve(event);
};
