<script lang="ts">
	import "../app.css";
	import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
	import { SvelteQueryDevtools } from "@tanstack/svelte-query-devtools";
	import favicon from "$lib/assets/favicon.svg";
	import Header from "@/components/header.svelte";

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: Infinity,
				refetchOnMount: false,
				refetchOnWindowFocus: false,
				refetchOnReconnect: false
			}
		}
	});

	let { children, data } = $props();
	const { session } = data
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if session}
	<Header />
{/if}
<QueryClientProvider client={queryClient}>
	<SvelteQueryDevtools />
	{@render children()}
</QueryClientProvider>

