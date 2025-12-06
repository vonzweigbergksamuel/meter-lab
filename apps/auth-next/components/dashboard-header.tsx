"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import type { User } from "@/lib/types";

export function DashboardHeader({ user }: { user: User }) {
	const router = useRouter();

	const handleSignOut = async () => {
		await authClient.signOut();
		router.push("/sign-in");
		router.refresh();
	};

	const initials = user.name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);

	return (
		<header className="border-b bg-card">
			<div className="container mx-auto flex h-16 items-center justify-between px-4">
				<div className="flex items-center gap-2">
					<h1 className="text-xl font-semibold">Auth Admin</h1>
				</div>
				<div className="flex items-center gap-4">
					<div className="flex items-center gap-2">
						<Avatar className="h-8 w-8">
							<AvatarImage src={user.image || undefined} alt={user.name} />
							<AvatarFallback className="text-xs">{initials}</AvatarFallback>
						</Avatar>
						<span className="text-sm font-medium">{user.name}</span>
					</div>
					<Button variant="ghost" size="icon" onClick={handleSignOut}>
						<LogOut className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</header>
	);
}
