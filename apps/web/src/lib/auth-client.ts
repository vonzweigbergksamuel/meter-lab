import { browser } from "$app/environment";
import { PUBLIC_AUTH_URL } from "$env/static/public";
import { createAuthClient } from "better-auth/svelte";
import { jwtClient } from "better-auth/client/plugins";

const isLocalUrl = PUBLIC_AUTH_URL.includes("localhost");
const isStagingUrl = PUBLIC_AUTH_URL.includes("34.51");

// TODO
// Just in development outside Docker
const getAuthUrl = () => {
	if (browser) {
		return PUBLIC_AUTH_URL;
	}
	
	if (isLocalUrl || isStagingUrl) {
		return PUBLIC_AUTH_URL;
	}
	
	return "http://auth:5090";
};

const authUrl = getAuthUrl();

console.log(authUrl)

export const authClient = createAuthClient({
	baseURL: authUrl,
	plugins: [jwtClient()],
	fetchOptions: {
		credentials: "include",
	},
});
