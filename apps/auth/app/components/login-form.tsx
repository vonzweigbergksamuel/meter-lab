import type { FC } from "hono/jsx";
import { Layout } from "./layout.js";

export const LoginForm: FC<{ error?: string }> = ({ error }) => {
	return (
		<Layout title="Admin Login">
			<div class="min-h-screen flex items-center justify-center">
				<div class="max-w-md w-full">
					<div class="bg-white rounded-lg shadow p-8">
						<h1 class="text-2xl font-bold text-gray-900 mb-6 text-center">
							Admin Login
						</h1>
						{error && (
							<div class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
								{error}
							</div>
						)}
						<form method="post" action="/admin/login" class="space-y-4">
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
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
								/>
							</div>
							<button
								type="submit"
								class="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
							>
								Sign In
							</button>
						</form>
					</div>
				</div>
			</div>
		</Layout>
	);
};
