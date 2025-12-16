<script lang="ts">
	import { getDeviceService } from "$lib/services/device.svelte";
	import DeviceCardSkeleton from "./device-card-skeleton.svelte";
	import DeviceCard from "./device-card.svelte";

	const deviceService = getDeviceService();
</script>

<div class="grid w-full grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 py-4">
	{#if deviceService.loading}
		<DeviceCardSkeleton />
		<DeviceCardSkeleton />
		<DeviceCardSkeleton />
		<DeviceCardSkeleton />
		<DeviceCardSkeleton />
	{:else if deviceService.error}
		<h1 class="col-span-6 text-center text-5xl font-bold text-destructive">
			Error loading devices
		</h1>
	{:else if !deviceService.all || deviceService.all.length === 0}
		<h1 class="col-span-6 text-center text-5xl font-bold">No Devices Connected</h1>
	{:else}
		{#each deviceService.all as device (device.device_id)}
			<DeviceCard device_id={device.device_id} device_status={device.device_status} />
		{/each}
	{/if}
</div>
