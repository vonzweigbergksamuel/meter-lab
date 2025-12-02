import type { FC } from "hono/jsx";
import type { User } from "./types.js";

export const UserTable: FC<{ users: User[] }> = ({ users }) => {
	return (
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
						<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
							Actions
						</th>
					</tr>
				</thead>
				<tbody class="bg-white divide-y divide-gray-200">
					{users.length === 0 ? (
						<tr>
							<td colspan={5} class="px-6 py-8 text-center text-gray-500">
								No other users found
							</td>
						</tr>
					) : (
						users.map((user) => <UserRow key={user.id} user={user} />)
					)}
				</tbody>
			</table>
		</div>
	);
};

const UserRow: FC<{ user: User }> = ({ user }) => {
	const newRole = user.role === "admin" ? "user" : "admin";
	return (
		<tr>
			<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
				{user.name}
			</td>
			<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
				{user.email}
			</td>
			<td class="px-6 py-4 whitespace-nowrap">
				<RoleBadge role={user.role} />
			</td>
			<td class="px-6 py-4 whitespace-nowrap">
				<StatusBadge banned={user.banned} />
			</td>
			<td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
				<div class="flex items-center gap-2 justify-end">
					<button
						type="button"
						data-user-id={user.id}
						data-user-name={user.name}
						data-new-role={newRole}
						class="role-btn text-purple-600 hover:text-purple-800 text-sm px-2 py-1 rounded hover:bg-purple-50"
					>
						{user.role === "admin" ? "Change to User" : "Change to Admin"}
					</button>
					<button
						type="button"
						data-user-id={user.id}
						class="password-btn text-blue-600 hover:text-blue-800 text-sm px-2 py-1 rounded hover:bg-blue-50"
					>
						Password
					</button>
					<button
						type="button"
						data-user-id={user.id}
						data-user-name={user.name}
						class="delete-btn text-red-600 hover:text-red-800 text-sm px-2 py-1 rounded hover:bg-red-50"
					>
						Delete
					</button>
				</div>
			</td>
		</tr>
	);
};

const RoleBadge: FC<{ role?: string | null }> = ({ role }) => {
	const isAdmin = role === "admin";
	return (
		<span
			class={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
				isAdmin ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-800"
			}`}
		>
			{role || "user"}
		</span>
	);
};

const StatusBadge: FC<{ banned?: boolean | null }> = ({ banned }) => {
	return (
		<span
			class={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
				banned ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
			}`}
		>
			{banned ? "Banned" : "Active"}
		</span>
	);
};
