// Define types explicitly to avoid importing server-side auth instance
export type User = {
	id: string;
	name: string;
	email: string;
	emailVerified: boolean;
	image?: string | null;
	createdAt: Date;
	updatedAt: Date;
	role?: string | null;
	banned?: boolean | null;
	banReason?: string | null;
	banExpires?: Date | null;
};

export type Session = {
	id: string;
	expiresAt: Date;
	token: string;
	createdAt: Date;
	updatedAt: Date;
	ipAddress: string | null;
	userAgent: string | null;
	userId: string;
	impersonatedBy: string | null;
};

export type UserWithMeta = User;
