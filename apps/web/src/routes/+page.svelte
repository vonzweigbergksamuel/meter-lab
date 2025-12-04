<script lang="ts">
	import { createQuery } from "@tanstack/svelte-query";
	import { rpc, ws } from "$lib/api/client";

	const query = createQuery(() =>
		rpc.healthCheck.queryOptions({
			input: {},
			context: { cache: false }
		})
	);

	const wsQuery = createQuery(() =>
		ws.healthCheck.queryOptions({
			input: {},
			context: { cache: false }
		})
	);
</script>

<h1>Welcome to Meter Lab</h1>
<button on:click={() => query.refetch()}>Refetch</button>

{#if wsQuery.isLoading}
	<p>Loading...</p>
{:else if wsQuery.isSuccess}
	<p>{wsQuery.data?.message}</p>
	<p>{wsQuery.data?.timestamp}</p>
{:else if wsQuery.isError}
	<p>{wsQuery.error?.message}</p>
{/if}
