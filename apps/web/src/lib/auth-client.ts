import { createAuthClient } from "better-auth/svelte"
import { browser } from "$app/environment";
import { PUBLIC_AUTH_URL } from "$env/static/public";

// Temporary solution to handle local development on localhost with docker
// TODO: Implement proper solution for production?
const isLocalUrl = PUBLIC_AUTH_URL.includes('localhost')

const devUrl = browser 
    ? PUBLIC_AUTH_URL
    : PUBLIC_AUTH_URL.replace('localhost', 'host.docker.internal');

const authUrl = isLocalUrl ? devUrl : PUBLIC_AUTH_URL;

export const authClient = createAuthClient({
    baseURL: authUrl
})