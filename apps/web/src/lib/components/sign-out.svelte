<script lang="ts">
	import { authClient } from "@/auth-client";
	import { Button } from "./ui/button";

	const signOut = async () => {
		await authClient.signOut();

		// Redirect to logout route which will delete httpOnly jwt cookie server-side
		window.location.href = "/logout";
	};
</script>

<Button onclick={signOut}>Sign Out</Button>
