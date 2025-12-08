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
	// const isStaging = event.url.origin.includes("localhost")
	const isStaging = event.url.origin.includes("34.51")
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
			let tokenData;
			let tokenError;
			
			if (isStaging) {
				// In staging, manually fetch to ensure cookie is forwarded correctly
				const cookieHeader = event.request.headers.get('cookie') || '';
				const { PUBLIC_AUTH_URL } = await import('$env/static/public');
				
				console.log('Fetching token from:', PUBLIC_AUTH_URL);
				console.log('Cookie header:', cookieHeader);
				
				const response = await fetch(`${PUBLIC_AUTH_URL}/api/auth/token`, {
					method: 'GET',
					headers: {
						'Cookie': cookieHeader,
					},
					credentials: 'include',
				});
				
				console.log('Token response status:', response.status);
				
				if (response.ok) {
					const result = await response.json();
					tokenData = { token: result.token };
				} else {
					const text = await response.text();
					console.log('Token response error:', text);
					tokenError = { status: response.status, statusText: response.statusText };
				}
			} else {
				const result = await authClient.token({
					fetchOptions: {
						headers: event.request.headers,
					},
				});
				tokenData = result.data;
				tokenError = result.error;
			}

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
