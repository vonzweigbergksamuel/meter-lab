<script lang="ts">
	import { createQuery } from "@tanstack/svelte-query";
	import { orpc } from "$lib/api/client";

	const query = createQuery(() =>
		orpc.healthCheck.queryOptions({
			input: {},
			context: { cache: false }
		})
	);
</script>

<h1>Welcome to Meter Lab</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

{#if query.isLoading}
	<p>Loading...</p>
{:else if query.isSuccess}
	<p>{query.data?.message}</p>
	<p>{query.data?.timestamp}</p>
{:else if query.isError}
	<p>{query.error?.message}</p>
{/if}

<button on:click={() => query.refetch()}>Refetch</button>
