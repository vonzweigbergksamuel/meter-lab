import type { FC } from "hono/jsx";
import { Layout } from "./layout.js";

interface User {
	id: string;
	name: string;
	email: string;
	role?: string | null;
	banned?: boolean | null;
}

export const UserList: FC<{ users: User[] }> = ({ users }) => {
	return (
		<Layout title="Admin - User Management">
			<div class="min-h-screen p-8">
				<div class="max-w-7xl mx-auto">
					<div class="mb-8 flex items-center justify-between">
						<h1 class="text-3xl font-bold text-gray-900">User Management</h1>
						<a
							href="/admin/create"
							class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
						>
							Create User
						</a>
					</div>

					<div class="bg-white rounded-lg shadow overflow-hidden">
						<table class="min-w-full divide-y divide-gray-200">
							<thead class="bg-gray-50">
								<tr>
									<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Name
									</th>
									<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Email
									</th>
									<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Role
									</th>
									<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Status
									</th>
									<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Actions
									</th>
								</tr>
							</thead>
							<tbody class="bg-white divide-y divide-gray-200">
								{users.map((user) => (
									<tr key={user.id}>
										<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
											{user.name}
										</td>
										<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											{user.email}
										</td>
										<td class="px-6 py-4 whitespace-nowrap">
											<span
												class={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
													user.role === "admin"
														? "bg-purple-100 text-purple-800"
														: "bg-gray-100 text-gray-800"
												}`}
											>
												{user.role || "user"}
											</span>
										</td>
										<td class="px-6 py-4 whitespace-nowrap">
											<span
												class={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
													user.banned
														? "bg-red-100 text-red-800"
														: "bg-green-100 text-green-800"
												}`}
											>
												{user.banned ? "Banned" : "Active"}
											</span>
										</td>
										<td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
											<form
												method="post"
												action={`/admin/api/users/${user.id}/role`}
												class="inline"
											>
												<select
													name="role"
													onchange="this.form.submit()"
													class="text-sm border-gray-300 rounded-md"
												>
													<option value="">Change Role</option>
													<option value="user">User</option>
													<option value="admin">Admin</option>
												</select>
											</form>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</Layout>
	);
};
