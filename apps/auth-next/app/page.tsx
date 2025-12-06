import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { CreateUserDialog } from "@/components/create-user-dialog";
import { DashboardHeader } from "@/components/dashboard-header";
import { DataTable } from "@/components/data-table";
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

	const users = (usersResponse.users || []) as UserWithMeta[];

	return (
		<div className="min-h-screen bg-background">
			<DashboardHeader user={session.user} />
			<main className="container mx-auto py-8 px-4">
				<div className="mb-6 flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold">Users</h1>
						<p className="text-muted-foreground">
							Manage users and their permissions
						</p>
					</div>
					<CreateUserDialog />
				</div>
				<DataTable columns={userColumns} data={users} />
			</main>
		</div>
	);
}
