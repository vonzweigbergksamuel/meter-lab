<script lang="ts">
	import "../app.css";
	import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
	import { SvelteQueryDevtools } from "@tanstack/svelte-query-devtools";
	import favicon from "$lib/assets/favicon.svg";
	import { Toaster } from "$lib/components/ui/sonner/index.js";
	import { ModeWatcher } from "mode-watcher";

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
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Toaster />
<ModeWatcher />
<div class="min-h-screen w-full">
	<QueryClientProvider client={queryClient}>
		<SvelteQueryDevtools />
		{@render children()}
	</QueryClientProvider>
</div>
