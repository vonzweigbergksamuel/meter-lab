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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth/auth-client";
import type { UserWithMeta } from "@/lib/types";

interface ResetPasswordDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	user: UserWithMeta;
}

export function ResetPasswordDialog({
	open,
	onOpenChange,
	user,
}: ResetPasswordDialogProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [newPassword, setNewPassword] = useState("");
	const router = useRouter();

	const handleResetPassword = async () => {
		setIsLoading(true);
		try {
			await authClient.admin.setUserPassword({
				userId: user.id,
				newPassword,
			});
			toast.success("Password reset successfully");
			setNewPassword("");
			onOpenChange(false);
			router.refresh();
		} catch {
			toast.error("Failed to reset password");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(open) => {
				if (!open) setNewPassword("");
				onOpenChange(open);
			}}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Reset Password</DialogTitle>
					<DialogDescription>
						Set a new password for user <b>{user.name}</b>.
					</DialogDescription>
				</DialogHeader>
				<div className="py-4">
					<Label htmlFor="password">New Password</Label>
					<Input
						id="password"
						type="password"
						value={newPassword}
						onChange={(e) => setNewPassword(e.target.value)}
						placeholder="Enter new password"
						className="mt-2"
					/>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button
						onClick={handleResetPassword}
						disabled={isLoading || newPassword.length < 8}
					>
						Reset Password
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
