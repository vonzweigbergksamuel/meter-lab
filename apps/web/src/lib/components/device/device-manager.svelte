<script lang="ts">
  import { createQuery } from "@tanstack/svelte-query";
	import { orpc } from "$lib/api/client";
	import DeviceCard from "./device-card.svelte";
  import DeviceCardSkeleton from "./device-card-skeleton.svelte";

  const response = createQuery(() => 
    orpc.device.queryOptions({
      input: {},
      context: { cache: false }
    })
  )

</script>

<div class="flex flex-col items-center w-ful">
  {#if response.isPending}
  <div class="flex flex-row gap-4 justify-start items-center my-5 mx-auto">
    <DeviceCardSkeleton />
    <DeviceCardSkeleton />
    <DeviceCardSkeleton />
    <DeviceCardSkeleton />
  </div>
  {:else if response.data?.devices.length === 0}
    <h1 class="text-5xl font-bold text-gray-500">No Devices Connected</h1>
  {:else}
    <div class="flex flex-row gap-4 justify-start items-center my-5 mx-auto">
      {#each response.data?.devices as device}
        <DeviceCard device_id={device.device_id} device_status={device.device_status} />
      {/each}
    </div>
  {/if}
</div>