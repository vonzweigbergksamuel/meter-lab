import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { CreateUserDialog } from "@/components/create-user-dialog";
import { DataTable } from "@/components/data-table";
import { AppSidebar } from "@/components/sidebar";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { userColumns } from "@/components/user-columns";
import { auth } from "@/lib/auth";
import type { UserWithMeta } from "@/lib/types";

export default async function DashboardPage() {
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

	const users = ((usersResponse.users || []) as UserWithMeta[]).filter(
		(user) => user.id !== session.user.id,
	);

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
						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem>
									<BreadcrumbPage>Users</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
					</div>
				</header>
				<div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold">Users</h1>
							<p className="text-muted-foreground">
								Manage users and their permissions
							</p>
						</div>
						<CreateUserDialog />
					</div>
					<DataTable columns={userColumns} data={users} />
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
