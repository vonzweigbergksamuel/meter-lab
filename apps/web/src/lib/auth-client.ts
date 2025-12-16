import { browser } from "$app/environment";
import { PUBLIC_AUTH_URL, PUBLIC_IS_LOCAL } from "$env/static/public";
import { jwtClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/svelte";

const isLocalUrl = PUBLIC_AUTH_URL.includes("localhost");
const isStagingUrl = PUBLIC_AUTH_URL.includes("nordicode");

const getAuthUrl = () => {
	// PUBLIC_IS_LOCAL is only needed when connecting to docker services but running the app with dev locally (not in docker)
	if ((isLocalUrl && PUBLIC_IS_LOCAL === "true") || browser) {
		return PUBLIC_AUTH_URL;
	}

	// isLocalUrl is only needed in local docker
	if (isLocalUrl) {
		return PUBLIC_AUTH_URL.replace("localhost", "host.docker.internal");
	}

	if (isStagingUrl) {
		return "http://auth:80";
	}

	return "http://auth:5090";
};

const authUrl = getAuthUrl();

console.log("Auth URL:", authUrl);

export const authClient = createAuthClient({
	baseURL: authUrl,
	plugins: [jwtClient()],
	fetchOptions: {
		credentials: "include"
	}
});
