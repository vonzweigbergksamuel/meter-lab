"use client";

import { Ban, KeyRound, MoreVertical, ShieldCheck, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import type { UserWithMeta } from "@/lib/types";
import { BanUserDialog } from "./ban-user-dialog";
import { ChangeRoleDialog } from "./change-role-dialog";
import { DeleteUserDialog } from "./delete-user-dialog";
import { ResetPasswordDialog } from "./reset-password-dialog";

type DialogType = "role" | "password" | "ban" | "delete" | null;

export function UserActions({ user }: { user: UserWithMeta }) {
	const [openDialog, setOpenDialog] = useState<DialogType>(null);
	const isMobile = useIsMobile();

	if (isMobile) {
		return (
			<>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon" className="h-8 w-8">
							<MoreVertical className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem onClick={() => setOpenDialog("role")}>
							<ShieldCheck className="h-4 w-4" />
							Change Role
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setOpenDialog("password")}>
							<KeyRound className="h-4 w-4" />
							Reset Password
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setOpenDialog("ban")}>
							<Ban className="h-4 w-4" />
							{user.banned ? "Unban" : "Ban"} User
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={() => setOpenDialog("delete")}
							className="text-destructive"
						>
							<Trash2 className="h-4 w-4" />
							Delete User
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

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
				/>
			</>
		);
	}

	return (
		<TooltipProvider>
			<div className="flex items-center justify-end gap-1">
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
			/>
		</TooltipProvider>
	);
}
