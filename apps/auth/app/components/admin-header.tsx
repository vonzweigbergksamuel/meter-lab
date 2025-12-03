import type { FC } from "hono/jsx";
import type { User } from "./types.js";

export const AdminHeader: FC<{ currentUser: User }> = ({ currentUser }) => {
	return (
		<header class="bg-white shadow">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
				<div class="flex items-center justify-between">
					<h1 class="text-2xl font-bold text-gray-900">User Management</h1>
					<div class="flex items-center gap-3">
						<button
							type="button"
							id="profile-btn"
							class="h-9 flex items-center gap-2 bg-purple-50 px-3 rounded-lg border border-purple-200 hover:bg-purple-100 transition cursor-pointer"
						>
							<div class="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold text-xs">
								{currentUser.name?.charAt(0).toUpperCase() || "A"}
							</div>
							<span class="text-sm font-medium text-gray-900">
								{currentUser.name}
							</span>
						</button>
						<form method="post" action="/admin/api/logout" class="my-auto">
							<button
								type="submit"
								class="h-9 px-3 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition border border-red-200"
							>
								Sign Out
							</button>
						</form>
					</div>
				</div>
			</div>
		</header>
	);
};
