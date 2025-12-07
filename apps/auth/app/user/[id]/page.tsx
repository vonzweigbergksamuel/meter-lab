import { ArrowLeft } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { UserDetailActions } from "@/components/actions/user-detail-actions";
import { AppSidebar } from "@/components/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import type { UserWithMeta } from "@/lib/types";

export default async function UserDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/sign-in");
	}

	if (session.user.role !== "admin") {
		redirect("/sign-in");
	}

	const usersResponse = await auth.api.listUsers({
		query: {},
		headers: await headers(),
	});

	const user = (usersResponse.users || []).find((u) => u.id === id) as
		| UserWithMeta
		| undefined;

	if (!user) {
		notFound();
	}

	const initials = user.name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);

	return (
		<SidebarProvider>
			<AppSidebar user={session.user} />
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator
							orientation="vertical"
							className="mr-2 data-[orientation=vertical]:h-4"
						/>
						<Button variant="ghost" size="icon" asChild className="h-7 w-7">
							<Link href="/">
								<ArrowLeft className="h-4 w-4" />
							</Link>
						</Button>
						<Separator
							orientation="vertical"
							className="mr-2 data-[orientation=vertical]:h-4"
						/>
						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem>
									<BreadcrumbLink href="/">Users</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator />
								<BreadcrumbItem>
									<BreadcrumbPage>User Details</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
					</div>
				</header>
				<div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
					<div>
						<h1 className="text-3xl font-bold">User Details</h1>
						<p className="text-muted-foreground">
							View and manage user information
						</p>
					</div>
					<div className="grid gap-6 md:grid-cols-3">
						<Card className="md:col-span-2">
							<CardHeader>
								<div className="flex items-start justify-between">
									<div className="flex items-center gap-4">
										<Avatar className="h-16 w-16">
											<AvatarImage
												src={user.image || undefined}
												alt={user.name}
											/>
											<AvatarFallback>{initials}</AvatarFallback>
										</Avatar>
										<div>
											<CardTitle className="text-2xl">{user.name}</CardTitle>
											<p className="text-muted-foreground">{user.email}</p>
										</div>
									</div>
								</div>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="grid gap-4 md:grid-cols-2">
									<div>
										<p className="text-sm font-medium text-muted-foreground">
											Role
										</p>
										<Badge
											variant={user.role === "admin" ? "default" : "secondary"}
											className="mt-1"
										>
											{user.role || "user"}
										</Badge>
									</div>
									<div>
										<p className="text-sm font-medium text-muted-foreground">
											Status
										</p>
										<Badge
											variant={user.banned ? "destructive" : "outline"}
											className="mt-1"
										>
											{user.banned ? "Banned" : "Active"}
										</Badge>
									</div>
									<div>
										<p className="text-sm font-medium text-muted-foreground">
											User ID
										</p>
										<p className="font-mono mt-1 text-sm">{user.id}</p>
									</div>
									<div>
										<p className="text-sm font-medium text-muted-foreground">
											Created At
										</p>
										<p className="mt-1 text-sm" suppressHydrationWarning>
											{new Date(user.createdAt).toLocaleString()}
										</p>
									</div>
									{user.emailVerified &&
										typeof user.emailVerified !== "boolean" && (
											<div>
												<p className="text-sm font-medium text-muted-foreground">
													Email Verified
												</p>
												<p className="mt-1 text-sm" suppressHydrationWarning>
													{new Date(user.emailVerified).toLocaleString()}
												</p>
											</div>
										)}
									<div>
										<p className="text-sm font-medium text-muted-foreground">
											Updated At
										</p>
										<p className="mt-1 text-sm" suppressHydrationWarning>
											{new Date(user.updatedAt).toLocaleString()}
										</p>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Actions</CardTitle>
							</CardHeader>
							<CardContent>
								<UserDetailActions user={user} />
							</CardContent>
						</Card>
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
