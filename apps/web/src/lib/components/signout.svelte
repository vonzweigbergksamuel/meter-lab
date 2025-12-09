<script lang="ts">
	import { authClient } from "@/auth-client";
	import { browser } from "$app/environment";

	if (browser) {
		const form = document.querySelector("form");
		form?.addEventListener("submit", async (event) => {
			event.preventDefault();

			await authClient.signOut();

			console.log("Submit Sign Out");

			window.location.href = "/login";
		});
	}
</script>

<form method="post" action="/admin/api/logout" class="my-auto">
	<button
		type="submit"
		class="h-9 rounded-lg border border-red-200 bg-red-50 px-3 text-sm font-medium text-red-600 transition hover:bg-red-100"
	>
		Sign Out
	</button>
</form>
