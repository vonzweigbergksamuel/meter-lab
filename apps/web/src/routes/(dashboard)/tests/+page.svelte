<script lang="ts">
	import { rpcClient } from "@/api/client";
	import HeroText from "@/components/hero-text.svelte";
	import Container from "@/components/ui/container.svelte";
	import { createWebSocketClient } from "$lib/api/websocket";
	import { Badge } from "$lib/components/ui/badge";
	import * as Card from "$lib/components/ui/card/index.js";
	import { setTestService, TestService, type TestData } from "$lib/services/test.svelte";
	import { onMount } from "svelte";

	const testService = new TestService();
	setTestService(testService);

	onMount(async () => {
		await testService.fetchTests(rpcClient);

		const wsClient = createWebSocketClient();
		if (wsClient) {
			testService.startStreaming(wsClient);
		}
	});

	const getStatusVariant = (status: TestData["status"]) => {
		switch (status) {
			case "completed":
				return "default";
			case "running":
				return "warning";
			case "failed":
				return "destructive";
			case "pending":
			default:
				return "secondary";
		}
	};

	const formatTestType = (type: TestData["testType"]) => {
		return type === "alive" ? "Alive Test" : "Stress Test";
	};
</script>

<Container className="mt-8">
	<HeroText title="Tests" />

	<div class="mt-8">
		{#if testService.loading}
			<div class="text-center text-muted-foreground">Loading tests...</div>
		{:else if testService.error}
			<div class="text-center text-destructive">
				<p class="font-semibold">Error loading tests</p>
				<p class="text-sm">{testService.error.message}</p>
			</div>
		{:else if testService.all.length === 0}
			<div class="text-center text-muted-foreground">No tests found</div>
		{:else}
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{#each testService.all as test (test.id)}
					<Card.Root class="gap-4">
						<Card.Header>
							<Card.Description class="text-xs font-light tracking-wide uppercase">
								{formatTestType(test.testType)}
							</Card.Description>
							<Card.Title class="text-lg/tight">{test.title}</Card.Title>
							<Card.Action class="flex flex-col items-center gap-2">
								<Badge variant={getStatusVariant(test.status)}>
									{test.status.charAt(0).toUpperCase() + test.status.slice(1)}
								</Badge>
								<span class="text-xs text-muted-foreground">
									{test.devices.length} device{test.devices.length !== 1 ? "s" : ""}
								</span>
							</Card.Action>
						</Card.Header>
						<Card.Content class="flex flex-col gap-3">
							<p class="text-sm text-muted-foreground">{test.description}</p>
							<div class="flex items-center gap-2"></div>
							{#if test.startAt}
								<p class="text-xs text-muted-foreground">
									Started: {new Date(test.startAt).toLocaleString()}
								</p>
							{/if}
							{#if test.endAt}
								<p class="text-xs text-muted-foreground">
									Ended: {new Date(test.endAt).toLocaleString()}
								</p>
							{/if}
						</Card.Content>
					</Card.Root>
				{/each}
			</div>
		{/if}
	</div>
</Container>
