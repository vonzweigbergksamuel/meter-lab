import { nextCookies } from "better-auth/next-js";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	plugins: [nextCookies()], // Make sure that nextCookies is the last plugin in the array
});
