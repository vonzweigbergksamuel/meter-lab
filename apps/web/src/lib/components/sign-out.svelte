<script lang="ts">
	import { authClient } from "@/auth-client";
	import { Button } from "./ui/button";

	const signOut = async () => {
		await authClient.signOut();
		window.location.href = "/sign-in";
	};
</script>

<Button onclick={signOut}>Sign Out</Button>
