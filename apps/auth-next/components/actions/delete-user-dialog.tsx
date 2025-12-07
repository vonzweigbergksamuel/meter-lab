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

interface DeleteUserDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	user: UserWithMeta;
	redirectOnDelete?: boolean;
}

export function DeleteUserDialog({
	open,
	onOpenChange,
	user,
	redirectOnDelete = false,
}: DeleteUserDialogProps) {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const handleDelete = async () => {
		setIsLoading(true);
		try {
			await authClient.admin.removeUser({ userId: user.id });
			toast.success("User deleted successfully");
			onOpenChange(false);
			if (redirectOnDelete) {
				router.push("/");
			} else {
				router.refresh();
			}
		} catch {
			toast.error("Failed to delete user");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Delete User</DialogTitle>
					<DialogDescription className="text-balance">
						Are you sure you want to delete user <b>{user.name}</b>? This action
						cannot be undone.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button
						variant="destructive"
						onClick={handleDelete}
						disabled={isLoading}
					>
						Delete
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
