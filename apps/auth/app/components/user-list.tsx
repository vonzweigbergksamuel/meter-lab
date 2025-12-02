import type { FC } from "hono/jsx";
import { AdminHeader } from "./admin-header.js";
import { Layout } from "./layout.js";
import { ModalScripts } from "./modal-scripts.js";
import type { User } from "./types.js";
import {
	DeleteUserModal,
	PasswordChangeModal,
	ProfileModal,
	RoleChangeModal,
} from "./user-modals.js";
import { UserTable } from "./user-table.js";

export const UserList: FC<{ users: User[]; currentUser: User }> = ({
	users,
	currentUser,
}) => {
	const otherUsers = users.filter((u) => u.id !== currentUser.id);

	return (
		<Layout title="Admin - User Management">
			<div class="min-h-screen">
				<AdminHeader currentUser={currentUser} />

				<div class="max-w-7xl mx-auto p-8">
					<div class="mb-6 flex items-center justify-end">
						<a
							href="/admin/create"
							class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
						>
							Create User
						</a>
					</div>

					<UserTable users={otherUsers} />
				</div>
			</div>

			<RoleChangeModal />
			<DeleteUserModal />
			<PasswordChangeModal />
			<ProfileModal currentUser={currentUser} />
			<ModalScripts />
		</Layout>
	);
};
