import type { FC } from "hono/jsx";
import { Layout } from "./layout.js";

export const UnauthorizedPage: FC = () => {
	return (
		<Layout title="Unauthorized">
			<div class="min-h-screen flex items-center justify-center">
				<div class="text-center">
					<h1 class="text-2xl font-bold text-gray-900 mb-4">Unauthorized</h1>
					<p class="text-gray-600 mb-4">
						You must be logged in as an admin to access this page.
					</p>
					<a
						href="/admin/login"
						class="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
					>
						Sign In
					</a>
				</div>
			</div>
		</Layout>
	);
};
