import { browser } from "$app/environment";
import { PUBLIC_AUTH_URL } from "$env/static/public";
import { createAuthClient } from "better-auth/svelte";

const isLocalUrl = PUBLIC_AUTH_URL.includes("localhost");

// TODO
// Just in development outside Docker
const getAuthUrl = () => {
	console.log(browser)
	if (browser) {
		return PUBLIC_AUTH_URL;
	}

	if (isLocalUrl) {
		return PUBLIC_AUTH_URL.replace("localhost", "host.docker.internal");
	}

	return "http://auth:5090";

	// Just in development outside Docker
	// return PUBLIC_AUTH_URL
};

const authUrl = getAuthUrl();

export const authClient = createAuthClient({
	baseURL: authUrl,
	fetchOptions: {
		credentials: "include",
	},
});
