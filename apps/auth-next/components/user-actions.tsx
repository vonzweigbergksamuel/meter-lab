"use client";

import { Ban, KeyRound, ShieldCheck, Trash2 } from "lucide-react";
import { useState } from "react";
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
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	banUser,
	deleteUser,
	resetUserPassword,
	unbanUser,
	updateUserRole,
} from "@/lib/actions/users";
import type { UserWithMeta } from "@/lib/types";

type DialogType = "role" | "password" | "ban" | "delete" | null;

export function UserActions({ user }: { user: UserWithMeta }) {
	const [openDialog, setOpenDialog] = useState<DialogType>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [newPassword, setNewPassword] = useState("");

	const handleAction = async (action: () => Promise<void>) => {
		setIsLoading(true);
		try {
			await action();
			setOpenDialog(null);
			setNewPassword("");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<TooltipProvider>
			<div className="flex items-center gap-1">
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="h-8 w-8"
							onClick={() => setOpenDialog("role")}
						>
							<ShieldCheck className="h-4 w-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>Change role</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="h-8 w-8"
							onClick={() => setOpenDialog("password")}
						>
							<KeyRound className="h-4 w-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>Reset password</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="h-8 w-8"
							onClick={() => setOpenDialog("ban")}
						>
							<Ban className="h-4 w-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>{user.banned ? "Unban" : "Ban"} user</TooltipContent>
				</Tooltip>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="h-8 w-8 text-destructive hover:text-destructive"
							onClick={() => setOpenDialog("delete")}
						>
							<Trash2 className="h-4 w-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>Delete user</TooltipContent>
				</Tooltip>
			</div>

			{/* Role Dialog */}
			<Dialog
				open={openDialog === "role"}
				onOpenChange={() => setOpenDialog(null)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Change Role</DialogTitle>
						<DialogDescription>
							Change the role for {user.name}
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="gap-2 sm:gap-0">
						<Button
							variant="outline"
							onClick={() =>
								handleAction(() => updateUserRole(user.id, "user"))
							}
							disabled={isLoading || user.role === "user"}
						>
							Set as User
						</Button>
						<Button
							onClick={() =>
								handleAction(() => updateUserRole(user.id, "admin"))
							}
							disabled={isLoading || user.role === "admin"}
						>
							Set as Admin
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Password Dialog */}
			<Dialog
				open={openDialog === "password"}
				onOpenChange={() => setOpenDialog(null)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Reset Password</DialogTitle>
						<DialogDescription>
							Set a new password for {user.name}
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
						<Button variant="outline" onClick={() => setOpenDialog(null)}>
							Cancel
						</Button>
						<Button
							onClick={() =>
								handleAction(() => resetUserPassword(user.id, newPassword))
							}
							disabled={isLoading || newPassword.length < 8}
						>
							Reset Password
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Ban Dialog */}
			<Dialog
				open={openDialog === "ban"}
				onOpenChange={() => setOpenDialog(null)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{user.banned ? "Unban" : "Ban"} User</DialogTitle>
						<DialogDescription>
							{user.banned
								? `Are you sure you want to unban ${user.name}?`
								: `Are you sure you want to ban ${user.name}?`}
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" onClick={() => setOpenDialog(null)}>
							Cancel
						</Button>
						<Button
							variant={user.banned ? "default" : "destructive"}
							onClick={() =>
								handleAction(() =>
									user.banned ? unbanUser(user.id) : banUser(user.id),
								)
							}
							disabled={isLoading}
						>
							{user.banned ? "Unban" : "Ban"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Delete Dialog */}
			<Dialog
				open={openDialog === "delete"}
				onOpenChange={() => setOpenDialog(null)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete User</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete {user.name}? This action cannot be
							undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" onClick={() => setOpenDialog(null)}>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={() => handleAction(() => deleteUser(user.id))}
							disabled={isLoading}
						>
							Delete
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</TooltipProvider>
	);
}
