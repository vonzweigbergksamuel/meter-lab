<script lang="ts">
	import { createQuery } from "@tanstack/svelte-query";
	import { rpc } from "$lib/api/client";
	import { wsClient } from "$lib/api/websocket";
	import { onMount } from "svelte";
	import DeviceCardSkeleton from "./device-card-skeleton.svelte";
	import DeviceCard from "./device-card.svelte";

	type Device = {
		device_id: string;
		device_status: "available" | "under_test";
	};

	let data: { devices: Device[] } = $state({ devices: [] });

	const response = createQuery(() =>
		rpc.device.queryOptions({
			input: {},
			context: { cache: false }
		})
	);

	$effect(() => {
		if (response.data?.devices) {
			data.devices = response.data.devices as Device[];
		}
	});

	onMount(() => {
		if (!wsClient) {
			return;
		}

		(async () => {
			try {
				const stream = await wsClient.deviceUpdates();

				for await (const event of stream) {
					console.log("WebSocket Event:", event);
					if (event?.devices && Array.isArray(event.devices)) {
						data.devices = event.devices as Device[];
					}
				}
			} catch (error) {
				console.error("WebSocket error:", error);
			}
		})();
	});
</script>

<div class="w-ful flex flex-col items-center">
	{#if response.isPending}
		<div class="mx-auto my-5 flex flex-col items-center justify-start gap-4 md:flex-row">
			<DeviceCardSkeleton />
			<DeviceCardSkeleton />
			<DeviceCardSkeleton />
			<DeviceCardSkeleton />
		</div>
	{:else if !data.devices || data.devices.length === 0}
		<h1 class="mt-8 text-5xl font-bold text-gray-500">No Devices Connected</h1>
	{:else}
		<div class="mx-auto my-5 flex flex-col items-center justify-start gap-4 md:flex-row">
			{#each data.devices as device (device.device_id)}
				<DeviceCard device_id={device.device_id} device_status={device.device_status} />
			{/each}
		</div>
	{/if}
</div>
