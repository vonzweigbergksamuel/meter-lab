import { browser } from "$app/environment";
import { PUBLIC_AUTH_URL, PUBLIC_IS_LOCAL } from "$env/static/public";
import { jwtClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/svelte";

const isLocalUrl = PUBLIC_AUTH_URL.includes("localhost");
const isStagingUrl = PUBLIC_AUTH_URL.includes("nordicode");

const getAuthUrl = () => {
	// PUBLIC_IS_LOCAL is only needed when connecting to docker services but running the app with dev locally (not in docker)
	if ((isLocalUrl && PUBLIC_IS_LOCAL === "true") || browser) {
		console.log("Using public is local:", PUBLIC_IS_LOCAL);
		console.log("Using public auth url:", PUBLIC_AUTH_URL);
		return PUBLIC_AUTH_URL;
	}

	// isLocalUrl is only needed in local docker
	if (isLocalUrl) {
		console.log("Using local auth url:", PUBLIC_AUTH_URL.replace("localhost", "host.docker.internal"));
		return PUBLIC_AUTH_URL.replace("localhost", "host.docker.internal");
	}

	if (isStagingUrl) {
		console.log("Using staging auth url:", "http://auth:80");
		return "http://auth:80";
	}

	console.log("Using default auth url:", "http://auth:5090");
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
