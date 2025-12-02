import type { FC } from "hono/jsx";
import { Layout } from "./layout.js";

export const CreateUserForm: FC = () => {
	return (
		<Layout title="Create User">
			<div class="min-h-screen p-8">
				<div class="max-w-2xl mx-auto">
					<div class="mb-8">
						<a
							href="/admin"
							class="text-blue-600 hover:text-blue-800 mb-4 inline-block"
						>
							← Back to Users
						</a>
						<h1 class="text-3xl font-bold text-gray-900">Create New User</h1>
					</div>

					<div class="bg-white rounded-lg shadow p-6">
						<form method="post" action="/admin/api/users" class="space-y-6">
							<div>
								<label
									for="name"
									class="block text-sm font-medium text-gray-700"
								>
									Name
								</label>
								<input
									type="text"
									id="name"
									name="name"
									required
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
								/>
							</div>

							<div>
								<label
									for="email"
									class="block text-sm font-medium text-gray-700"
								>
									Email
								</label>
								<input
									type="email"
									id="email"
									name="email"
									required
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
								/>
							</div>

							<div>
								<label
									for="password"
									class="block text-sm font-medium text-gray-700"
								>
									Password
								</label>
								<input
									type="password"
									id="password"
									name="password"
									required
									minlength={8}
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
								/>
							</div>

							<div>
								<label
									for="role"
									class="block text-sm font-medium text-gray-700"
								>
									Role
								</label>
								<select
									id="role"
									name="role"
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
								>
									<option value="user">User</option>
									<option value="admin">Admin</option>
								</select>
							</div>

							<div class="flex gap-4">
								<button
									type="submit"
									class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
								>
									Create User
								</button>
								<a
									href="/admin"
									class="flex-1 text-center bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition"
								>
									Cancel
								</a>
							</div>
						</form>
					</div>
				</div>
			</div>
		</Layout>
	);
};
