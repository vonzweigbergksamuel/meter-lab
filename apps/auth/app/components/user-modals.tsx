import type { FC } from "hono/jsx";
import { Modal, ModalActions, ModalButton, ModalTitle } from "./modal.js";
import type { User } from "./types.js";

export const RoleChangeModal: FC = () => {
	return (
		<Modal id="role-modal">
			<ModalTitle>Confirm Role Change</ModalTitle>
			<p id="role-modal-message" class="text-gray-600 mb-6" />
			<form id="role-form" method="post" action="">
				<input type="hidden" name="role" id="role-input" />
				<ModalActions>
					<ModalButton onclick="closeModal('role-modal')">Cancel</ModalButton>
					<ModalButton type="submit" variant="primary">
						Confirm
					</ModalButton>
				</ModalActions>
			</form>
		</Modal>
	);
};

export const DeleteUserModal: FC = () => {
	return (
		<Modal id="delete-modal">
			<ModalTitle variant="danger">Delete User</ModalTitle>
			<p id="delete-modal-message" class="text-gray-600 mb-6" />
			<form id="delete-form" method="post" action="">
				<ModalActions>
					<ModalButton onclick="closeModal('delete-modal')">Cancel</ModalButton>
					<ModalButton type="submit" variant="danger">
						Delete User
					</ModalButton>
				</ModalActions>
			</form>
		</Modal>
	);
};

export const PasswordChangeModal: FC = () => {
	return (
		<Modal id="password-modal">
			<ModalTitle>Change Password</ModalTitle>
			<form id="password-form" method="post" action="">
				<div class="mb-4">
					<label
						for="new-password"
						class="block text-sm font-medium text-gray-700 mb-1"
					>
						New Password
					</label>
					<input
						type="password"
						id="new-password"
						name="newPassword"
						required
						minLength={8}
						class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						placeholder="Enter new password (min 8 characters)"
					/>
				</div>
				<ModalActions>
					<ModalButton onclick="closeModal('password-modal')">
						Cancel
					</ModalButton>
					<ModalButton type="submit" variant="primary">
						Update Password
					</ModalButton>
				</ModalActions>
			</form>
		</Modal>
	);
};

export const ProfileModal: FC<{ currentUser: User }> = ({ currentUser }) => {
	return (
		<Modal id="profile-modal">
			<ModalTitle>My Profile</ModalTitle>
			<div class="space-y-4 mb-6">
				<div class="flex items-center gap-4">
					<div class="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold text-lg">
						{currentUser.name?.charAt(0).toUpperCase() || "A"}
					</div>
					<div>
						<p class="font-medium text-gray-900">{currentUser.name}</p>
						<p class="text-sm text-gray-500">{currentUser.email}</p>
					</div>
				</div>
				<div class="border-t pt-4">
					<div class="grid grid-cols-2 gap-2 text-sm">
						<span class="text-gray-500">Role</span>
						<span class="font-medium text-purple-600">
							{currentUser.role || "user"}
						</span>
						<span class="text-gray-500">Status</span>
						<span class="font-medium text-green-600">Active</span>
					</div>
				</div>
			</div>
			<div id="profile-password-section" class="border-t pt-4 hidden">
				<form
					id="profile-password-form"
					method="post"
					action={`/admin/api/users/${currentUser.id}/password`}
				>
					<label
						for="profile-new-password"
						class="block text-sm font-medium text-gray-700 mb-1"
					>
						New Password
					</label>
					<input
						type="password"
						id="profile-new-password"
						name="newPassword"
						required
						minLength={8}
						class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-3"
						placeholder="Enter new password (min 8 characters)"
					/>
					<div class="flex gap-2">
						<button
							type="button"
							onclick="hideProfilePasswordSection()"
							class="flex-1 px-3 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition text-sm"
						>
							Cancel
						</button>
						<button
							type="submit"
							class="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
						>
							Update
						</button>
					</div>
				</form>
			</div>
			<ModalActions id="profile-actions">
				<ModalButton onclick="closeModal('profile-modal')">Close</ModalButton>
				<ModalButton onclick="showProfilePasswordSection()" variant="primary">
					Change Password
				</ModalButton>
			</ModalActions>
		</Modal>
	);
};
