<script lang="ts">
	import { rpcClient } from "@/api/client";
	import HeroText from "@/components/hero-text.svelte";
	import Container from "@/components/ui/container.svelte";
	import { page } from "$app/stores";
	import { Badge } from "$lib/components/ui/badge";
	import * as Card from "$lib/components/ui/card/index.js";
	import { getDeviceService } from "$lib/services/device.svelte";
	import { onMount } from "svelte";

	type TestData = {
		id: number;
		title: string;
		description: string;
		testType: "alive" | "stress";
		status: "pending" | "running" | "completed" | "failed";
		startAt: Date | null;
		endAt: Date | null;
		devices: string[];
	};

	const deviceService = getDeviceService();

	const testId = $derived($page.params.id ? Number($page.params.id) : null);

	let test = $state<TestData | null>(null);
	let loading = $state(false);
	let error = $state<Error | null>(null);

	async function fetchTest() {
		if (!testId || isNaN(testId)) return;

		try {
			loading = true;
			error = null;
			const response = await rpcClient.tests.findTests({ id: testId });
			const testData = response as TestData;
			test = {
				...testData,
				startAt: testData.startAt
					? testData.startAt instanceof Date
						? testData.startAt
						: new Date(testData.startAt)
					: null,
				endAt: testData.endAt
					? testData.endAt instanceof Date
						? testData.endAt
						: new Date(testData.endAt)
					: null
			};
		} catch (err) {
			error = err instanceof Error ? err : new Error(String(err));
			console.error("Error fetching test:", error);
			test = null;
		} finally {
			loading = false;
		}
	}

	onMount(async () => {
		if (testId && !isNaN(testId)) {
			await fetchTest();
		}
	});

	$effect(() => {
		if (testId && !isNaN(testId) && test?.id !== testId) {
			fetchTest();
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

	const testDevices = $derived(
		test
			? test.devices.map((deviceId) => {
					const device = deviceService.all.find((d) => d.device_id === deviceId);
					return {
						device_id: deviceId,
						device_status: device?.device_status ?? "unknown"
					};
				})
			: []
	);

	const getDeviceStatusVariant = (status: string) => {
		switch (status) {
			case "available":
				return "default";
			case "under_test":
				return "warning";
			default:
				return "secondary";
		}
	};
</script>

<Container className="mt-8">
	<HeroText title="Test Details" />

	<div class="mt-8">
		{#if loading}
			<div class="text-center text-muted-foreground">Loading test details...</div>
		{:else if error}
			<div class="text-center text-destructive">
				<p class="font-semibold">Error loading test</p>
				<p class="text-sm">{error.message}</p>
			</div>
		{:else if !test}
			<div class="text-center text-muted-foreground">Test not found</div>
		{:else}
			<div class="flex flex-col gap-6">
				<Card.Root>
					<Card.Header>
						<Card.Description class="text-xs font-light tracking-wide uppercase">
							{formatTestType(test.testType)}
						</Card.Description>
						<Card.Title class="text-2xl/tight">{test.title}</Card.Title>
						<Card.Action class="flex items-center gap-2">
							<Badge variant={getStatusVariant(test.status)}>
								{test.status.charAt(0).toUpperCase() + test.status.slice(1)}
							</Badge>
						</Card.Action>
					</Card.Header>
					<Card.Content class="flex flex-col gap-4">
						<p class="text-sm text-muted-foreground">{test.description}</p>
						<div class="flex flex-col gap-2">
							{#if test.startAt}
								<p class="text-sm">
									<span class="font-medium">Started:</span>{" "}
									<span class="text-muted-foreground">
										{new Date(test.startAt).toLocaleString()}
									</span>
								</p>
							{/if}
							{#if test.endAt}
								<p class="text-sm">
									<span class="font-medium">Ended:</span>{" "}
									<span class="text-muted-foreground">
										{new Date(test.endAt).toLocaleString()}
									</span>
								</p>
							{/if}
						</div>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header>
						<Card.Title class="text-xl">Devices Tested</Card.Title>
						<Card.Description class="text-sm text-muted-foreground">
							{testDevices.length} device{testDevices.length !== 1 ? "s" : ""}
						</Card.Description>
					</Card.Header>
					<Card.Content>
						{#if testDevices.length === 0}
							<p class="text-sm text-muted-foreground">No devices found</p>
						{:else}
							<div class="flex flex-col gap-2">
								{#each testDevices as device}
									<div class="flex items-center justify-between rounded-lg border p-3">
										<div class="flex flex-col gap-1">
											<span class="font-medium">{device.device_id}</span>
										</div>
										<Badge variant={getDeviceStatusVariant(device.device_status)}>
											{device.device_status === "available"
												? "Available"
												: device.device_status === "under_test"
													? "Under Test"
													: "Unknown"}
										</Badge>
									</div>
								{/each}
							</div>
						{/if}
					</Card.Content>
				</Card.Root>
			</div>
		{/if}
	</div>
</Container>
