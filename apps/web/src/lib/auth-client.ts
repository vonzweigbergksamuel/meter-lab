import { createAuthClient } from "better-auth/svelte"
import { AUTH_URL } from "$env/static/private";

export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: AUTH_URL
})