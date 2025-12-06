"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { UserWithMeta } from "@/lib/types";
import { UserActions } from "./user-actions";

export const userColumns: ColumnDef<UserWithMeta>[] = [
	{
		accessorKey: "name",
		header: "User",
		cell: ({ row }) => {
			const user = row.original;
			const initials = user.name
				.split(" ")
				.map((n) => n[0])
				.join("")
				.toUpperCase()
				.slice(0, 2);

			return (
				<div className="flex items-center gap-3">
					<Avatar className="h-8 w-8">
						<AvatarImage src={user.image || undefined} alt={user.name} />
						<AvatarFallback className="text-xs">{initials}</AvatarFallback>
					</Avatar>
					<div className="flex flex-col">
						<span className="font-medium">{user.name}</span>
						<span className="text-sm text-muted-foreground">{user.email}</span>
					</div>
				</div>
			);
		},
	},
	{
		accessorKey: "role",
		header: "Role",
		cell: ({ row }) => {
			const role = row.getValue("role") as string | null;
			return (
				<Badge variant={role === "admin" ? "default" : "secondary"}>
					{role || "user"}
				</Badge>
			);
		},
	},
	{
		accessorKey: "banned",
		header: "Status",
		cell: ({ row }) => {
			const banned = row.getValue("banned") as boolean | null;
			return (
				<Badge variant={banned ? "destructive" : "outline"}>
					{banned ? "Banned" : "Active"}
				</Badge>
			);
		},
	},
	{
		accessorKey: "createdAt",
		header: "Created",
		cell: ({ row }) => {
			const date = row.getValue("createdAt") as Date;
			return (
				<span
					className="text-sm text-muted-foreground"
					suppressHydrationWarning
				>
					{new Date(date).toLocaleDateString()}
				</span>
			);
		},
	},
	{
		id: "actions",
		header: "",
		cell: ({ row }) => {
			return <UserActions user={row.original} />;
		},
	},
];
