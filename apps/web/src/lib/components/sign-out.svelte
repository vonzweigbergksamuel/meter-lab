<script lang="ts">
	import { authClient } from "@/auth-client";
	import { Button } from "./ui/button";

	const signOut = async () => {
		await authClient.signOut();

		// Remove JWT cookies
		document.cookie = "jwt; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
		document.cookie = "jwt-client; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"

		window.location.href = "/sign-in";
	};
</script>

<Button onclick={signOut}>Sign Out</Button>
