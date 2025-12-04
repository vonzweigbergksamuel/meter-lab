<script lang="ts">
  import { createQuery } from "@tanstack/svelte-query";
  import { onMount } from "svelte";
	import { orpc } from "$lib/api/client";
	import DeviceCard from "./device-card.svelte";
  import DeviceCardSkeleton from "./device-card-skeleton.svelte";
  import { wsClient } from "$lib/api/websocket";

  type Device = {
    device_id: string
    device_status: "available" | "under_test"
  }

  let data: { devices: Device[] } = $state({ devices: [] })

  const response = createQuery(() => 
    orpc.device.queryOptions({
      input: {},
      context: { cache: false }
    })
  )

  $effect(() => {
    if (response.data?.devices) {
      data.devices = response.data.devices as Device[]
    }
  })

  onMount(() => {
    if (!wsClient) {
      return
    };

    const controller = new AbortController();

    (async () => {
      try {
        const stream = await wsClient.deviceUpdates(undefined, { signal: controller.signal });
        
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

    return () => controller.abort();
  });
</script>

<div class="flex flex-col items-center w-ful">
  {#if response.isPending}
    <div class="flex flex-row gap-4 justify-start items-center my-5 mx-auto">
      <DeviceCardSkeleton />
      <DeviceCardSkeleton />
      <DeviceCardSkeleton />
      <DeviceCardSkeleton />
    </div>
  {:else if !data.devices || data.devices.length === 0}
    <h1 class="text-5xl font-bold text-gray-500 mt-8">No Devices Connected</h1>
  {:else}
    <div class="flex flex-row gap-4 justify-start items-center my-5 mx-auto">
      {#each data.devices as device (device.device_id)}
        <DeviceCard device_id={device.device_id} device_status={device.device_status} />
      {/each}
    </div>
  {/if}
</div>