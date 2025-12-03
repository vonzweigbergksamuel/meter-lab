import { browser } from "$app/environment";
import { PUBLIC_AUTH_URL } from "$env/static/public";
import { createAuthClient } from "better-auth/svelte";

console.log("PUBLIC_AUTH_URL: ", PUBLIC_AUTH_URL);

const getAuthUrl = () => {
	if (browser) {
		return PUBLIC_AUTH_URL;
	}

	if (PUBLIC_AUTH_URL.includes("localhost")) {
		return PUBLIC_AUTH_URL.replace("localhost", "host.docker.internal");
	}

	return "http://auth:5090";
};

const authUrl = getAuthUrl();
console.log("authUrl: ", authUrl);

export const authClient = createAuthClient({
	baseURL: authUrl
});
