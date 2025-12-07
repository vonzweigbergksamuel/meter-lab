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

interface ChangeRoleDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	user: UserWithMeta;
}

export function ChangeRoleDialog({
	open,
	onOpenChange,
	user,
}: ChangeRoleDialogProps) {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const handleChangeRole = async (role: "user" | "admin") => {
		setIsLoading(true);
		try {
			await authClient.admin.setRole({
				userId: user.id,
				role,
			});
			toast.success("Role updated successfully");
			onOpenChange(false);
			router.refresh();
		} catch {
			toast.error("Failed to update role");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Change Role</DialogTitle>
					<DialogDescription className="text-balance">
						Change the role for user <b>{user.name}</b>.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => handleChangeRole("user")}
						disabled={isLoading || user.role === "user"}
					>
						Set as User
					</Button>
					<Button
						onClick={() => handleChangeRole("admin")}
						disabled={isLoading || user.role === "admin"}
					>
						Set as Admin
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
