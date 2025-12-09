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
            const newDevices = event.devices as Device[];
            const newDeviceIds = new Set(newDevices.map(d => d.device_id));
            
            // Remove devices that are no longer in the list
            data.devices = data.devices.filter(d => newDeviceIds.has(d.device_id));
            
            // Add or update devices
            for (const newDevice of newDevices) {
              const existingIndex = data.devices.findIndex(d => d.device_id === newDevice.device_id);
              if (existingIndex >= 0) {
                // Update existing device if status changed
                if (data.devices[existingIndex].device_status !== newDevice.device_status) {
                  data.devices[existingIndex] = newDevice;
                }
              } else {
                // Add new device
                data.devices.push(newDevice);
              }
            }
          }
        }
      } catch (error) {
        console.error("WebSocket error:", error);
      }
    })();
  });
</script>

<div class="grid w-full grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 py-10">
	{#if response.isPending}
		<DeviceCardSkeleton />
		<DeviceCardSkeleton />
		<DeviceCardSkeleton />
		<DeviceCardSkeleton />
	{:else if !data.devices || data.devices.length === 0}
		<h1 class="col-span-6 text-center text-5xl font-bold text-gray-500">No Devices Connected</h1>
	{:else}
		{#each data.devices as device (device.device_id)}
			<DeviceCard device_id={device.device_id} device_status={device.device_status} />
		{/each}
	{/if}
</div>
