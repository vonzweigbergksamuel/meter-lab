// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?: {
				id: string;
				name: string | null;
				email: string;
				emailVerified: boolean;
				image: string | null;
			} | null;
			session?: {
				id: string;
				expiresAt: Date;
				ipAddress: string | null;
				userAgent: string | null;
			} | null;
			jwt?: string;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
