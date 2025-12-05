<script lang="ts">
	import "../app.css";
	import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
	import { SvelteQueryDevtools } from "@tanstack/svelte-query-devtools";
	import favicon from "$lib/assets/favicon.svg";
	import Header from "@/components/header.svelte";
	import Footer from "@/components/footer.svelte";

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
 
	// data is the current session of the user
	let { children, data } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="w-full min-h-screen">
	{#if data.session}
		<Header />
	{/if}
	<QueryClientProvider client={queryClient}>
		<SvelteQueryDevtools />
		{@render children()}
	</QueryClientProvider>
	
	{#if data.session}
		<Footer />
	{/if}
</div>

