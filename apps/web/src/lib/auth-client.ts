import { browser } from "$app/environment";
import { PUBLIC_AUTH_URL } from "$env/static/public";
import { createAuthClient } from "better-auth/svelte";
import { jwtClient } from "better-auth/client/plugins";

const isLocalUrl = PUBLIC_AUTH_URL.includes("localhost");

const getAuthUrl = () => {
	if (browser) {
		return PUBLIC_AUTH_URL;
	}

	if (isLocalUrl) {
		return PUBLIC_AUTH_URL.replace("localhost", "host.docker.internal");
	}

	return "http://auth:5090";
};

const authUrl = getAuthUrl();

export const authClient = createAuthClient({
	baseURL: authUrl,
	plugins: [jwtClient()]
});
