"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function createUser(data: {
	name: string;
	email: string;
	password: string;
	role?: "user" | "admin";
}) {
	const result = await auth.api.createUser({
		body: {
			name: data.name,
			email: data.email,
			password: data.password,
			role: (data.role || "user") as "user" | "admin",
		},
	});

	revalidatePath("/");
	return result;
}

export async function updateUserRole(userId: string, role: "user" | "admin") {
	await auth.api.setRole({
		body: { userId, role },
		headers: await headers(),
	});

	revalidatePath("/");
}

export async function resetUserPassword(userId: string, newPassword: string) {
	await auth.api.setUserPassword({
		body: { userId, newPassword },
	});

	revalidatePath("/");
}

export async function banUser(userId: string, reason?: string) {
	await auth.api.banUser({
		body: { userId, banReason: reason },
	});

	revalidatePath("/");
}

export async function unbanUser(userId: string) {
	await auth.api.unbanUser({
		body: { userId },
	});

	revalidatePath("/");
}

export async function deleteUser(userId: string) {
	await auth.api.removeUser({
		body: { userId },
	});

	revalidatePath("/");
}
