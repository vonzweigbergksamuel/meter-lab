"use client";

import { Ban, KeyRound, ShieldCheck, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { UserWithMeta } from "@/lib/types";
import { BanUserDialog } from "./ban-user-dialog";
import { ChangeRoleDialog } from "./change-role-dialog";
import { DeleteUserDialog } from "./delete-user-dialog";
import { ResetPasswordDialog } from "./reset-password-dialog";

type DialogType = "role" | "password" | "ban" | "delete" | null;

export function UserDetailActions({ user }: { user: UserWithMeta }) {
	const [openDialog, setOpenDialog] = useState<DialogType>(null);

	return (
		<>
			<div className="flex flex-col gap-2">
				<Button
					variant="outline"
					className="w-full justify-start"
					onClick={() => setOpenDialog("role")}
				>
					<ShieldCheck className="mr-2 h-4 w-4" />
					Change Role
				</Button>

				<Button
					variant="outline"
					className="w-full justify-start"
					onClick={() => setOpenDialog("password")}
				>
					<KeyRound className="mr-2 h-4 w-4" />
					Reset Password
				</Button>

				<Button
					variant="outline"
					className="w-full justify-start"
					onClick={() => setOpenDialog("ban")}
				>
					<Ban className="mr-2 h-4 w-4" />
					{user.banned ? "Unban User" : "Ban User"}
				</Button>

				<Button
					variant="destructive"
					className="w-full justify-start"
					onClick={() => setOpenDialog("delete")}
				>
					<Trash2 className="mr-2 h-4 w-4" />
					Delete User
				</Button>
			</div>

			<ChangeRoleDialog
				open={openDialog === "role"}
				onOpenChange={(open) => setOpenDialog(open ? "role" : null)}
				user={user}
			/>
			<ResetPasswordDialog
				open={openDialog === "password"}
				onOpenChange={(open) => setOpenDialog(open ? "password" : null)}
				user={user}
			/>
			<BanUserDialog
				open={openDialog === "ban"}
				onOpenChange={(open) => setOpenDialog(open ? "ban" : null)}
				user={user}
			/>
			<DeleteUserDialog
				open={openDialog === "delete"}
				onOpenChange={(open) => setOpenDialog(open ? "delete" : null)}
				user={user}
				redirectOnDelete
			/>
		</>
	);
}
