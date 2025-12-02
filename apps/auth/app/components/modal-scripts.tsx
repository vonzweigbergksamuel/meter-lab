import type { FC } from "hono/jsx";

export const ModalScripts: FC = () => {
	return (
		<script
			dangerouslySetInnerHTML={{
				__html: `
				function closeModal(id) {
					document.getElementById(id).classList.add('hidden');
					if (id === 'password-modal') {
						document.getElementById('new-password').value = '';
					}
					if (id === 'profile-modal') {
						hideProfilePasswordSection();
					}
				}

				function closeAllModals() {
					document.querySelectorAll('.modal').forEach(m => {
						m.classList.add('hidden');
					});
					hideProfilePasswordSection();
					const pwInput = document.getElementById('new-password');
					if (pwInput) pwInput.value = '';
				}

				function showProfilePasswordSection() {
					document.getElementById('profile-password-section').classList.remove('hidden');
					document.getElementById('profile-actions').classList.add('hidden');
				}

				function hideProfilePasswordSection() {
					const section = document.getElementById('profile-password-section');
					const actions = document.getElementById('profile-actions');
					const input = document.getElementById('profile-new-password');
					if (section) section.classList.add('hidden');
					if (actions) actions.classList.remove('hidden');
					if (input) input.value = '';
				}

				document.addEventListener('keydown', function(e) {
					if (e.key === 'Escape') {
						closeAllModals();
					}
				});

				document.getElementById('profile-btn')?.addEventListener('click', function() {
					document.getElementById('profile-modal').classList.remove('hidden');
				});

				document.querySelectorAll('.role-btn').forEach(btn => {
					btn.addEventListener('click', function() {
						const userId = this.dataset.userId;
						const userName = this.dataset.userName;
						const newRole = this.dataset.newRole;
						const roleText = newRole === 'admin' ? 'Admin' : 'User';
						
						document.getElementById('role-modal-message').textContent = 
							'Are you sure you want to change ' + userName + '\\'s role to ' + roleText + '?';
						document.getElementById('role-form').action = '/admin/api/users/' + userId + '/role';
						document.getElementById('role-input').value = newRole;
						document.getElementById('role-modal').classList.remove('hidden');
					});
				});

				document.querySelectorAll('.delete-btn').forEach(btn => {
					btn.addEventListener('click', function() {
						const userId = this.dataset.userId;
						const userName = this.dataset.userName;
						
						document.getElementById('delete-modal-message').textContent = 
							'Are you sure you want to permanently delete ' + userName + '? This action cannot be undone.';
						document.getElementById('delete-form').action = '/admin/api/users/' + userId + '/delete';
						document.getElementById('delete-modal').classList.remove('hidden');
					});
				});

				document.querySelectorAll('.password-btn').forEach(btn => {
					btn.addEventListener('click', function() {
						const userId = this.dataset.userId;
						document.getElementById('password-form').action = '/admin/api/users/' + userId + '/password';
						document.getElementById('password-modal').classList.remove('hidden');
					});
				});

				document.querySelectorAll('.modal').forEach(modal => {
					modal.addEventListener('click', function(e) {
						if (e.target === this) closeModal(this.id);
					});
				});
			`,
			}}
		/>
	);
};
