"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { UserWithMeta } from "@/lib/types";
import { UserActions } from "./actions/user-actions";

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
				<Link
					href={`/user/${user.id}`}
					className="flex items-center gap-3 hover:underline"
				>
					<Avatar className="h-8 w-8">
						<AvatarImage src={user.image || undefined} alt={user.name} />
						<AvatarFallback className="text-xs">{initials}</AvatarFallback>
					</Avatar>
					<div className="flex flex-col">
						<span className="font-medium">{user.name}</span>
						<span className="text-sm text-muted-foreground">{user.email}</span>
					</div>
				</Link>
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
		header: () => <span className="hidden md:inline">Status</span>,
		cell: ({ row }) => {
			const banned = row.getValue("banned") as boolean | null;
			return (
				<Badge
					variant={banned ? "destructive" : "outline"}
					className="hidden md:inline-flex"
				>
					{banned ? "Banned" : "Active"}
				</Badge>
			);
		},
	},
	{
		accessorKey: "createdAt",
		header: () => <span className="hidden md:inline">Created</span>,
		cell: ({ row }) => {
			const date = row.getValue("createdAt") as Date;
			return (
				<span
					className="hidden text-sm text-muted-foreground md:inline"
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
