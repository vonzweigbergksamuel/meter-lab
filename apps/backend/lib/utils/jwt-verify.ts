import { createRemoteJWKSet, jwtVerify } from "jose";
import { env } from "../../env.js";

const JWKS = createRemoteJWKSet(
	new URL(`${env.AUTH_SERVICE_URL}/api/auth/jwks`),
);

export interface JWTPayload {
	sub: string;
	email?: string;
	name?: string;
	role?: string;
	[key: string]: unknown;
}

export async function verifyJWT(
	authHeader: string | null,
): Promise<JWTPayload> {
	if (!authHeader) {
		throw new Error("Missing Authorization header");
	}

	const parts = authHeader.split(" ");
	if (parts.length !== 2 || parts[0] !== "Bearer") {
		throw new Error("Invalid Authorization header format");
	}

	const token = parts[1];

	console.warn("JWKS", JWKS);

	try {
		const { payload } = await jwtVerify(token, JWKS, {
			issuer: env.AUTH_SERVICE_URL,
			audience: env.AUTH_SERVICE_URL,
		});

		return payload as JWTPayload;
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(`JWT verification failed: ${error.message}`);
		}
		throw new Error("JWT verification failed");
	}
}
