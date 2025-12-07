"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { authClient } from "@/lib/auth/auth-client";
import type { UserWithMeta } from "@/lib/types";

interface BanUserDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	user: UserWithMeta;
}

export function BanUserDialog({
	open,
	onOpenChange,
	user,
}: BanUserDialogProps) {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const handleBanToggle = async () => {
		setIsLoading(true);
		try {
			if (user.banned) {
				await authClient.admin.unbanUser({ userId: user.id });
				toast.success("User unbanned successfully");
			} else {
				await authClient.admin.banUser({ userId: user.id });
				toast.success("User banned successfully");
			}
			onOpenChange(false);
			router.refresh();
		} catch {
			toast.error(`Failed to ${user.banned ? "unban" : "ban"} user`);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{user.banned ? "Unban" : "Ban"} User</DialogTitle>
					<DialogDescription className="text-balance">
						Are you sure you want to {user.banned ? "unban" : "ban"} user{" "}
						<b>{user.name}</b>?
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button
						variant={user.banned ? "default" : "destructive"}
						onClick={handleBanToggle}
						disabled={isLoading}
					>
						{user.banned ? "Unban" : "Ban"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
