import { browser } from "$app/environment";
import { PUBLIC_AUTH_URL, PUBLIC_IS_DOCKER } from "$env/static/public";
import { jwtClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/svelte";

const isLocalUrl = PUBLIC_AUTH_URL.includes("localhost");
const isExternalUrl = PUBLIC_AUTH_URL.startsWith("https://");

const getAuthUrl = () => {
	if ((isLocalUrl && !PUBLIC_IS_DOCKER) || browser) {
		return PUBLIC_AUTH_URL;
	}

	// isLocalUrl is only needed in local docker
	if (isLocalUrl) {
		return PUBLIC_AUTH_URL;
	}

	if (isExternalUrl) {
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
