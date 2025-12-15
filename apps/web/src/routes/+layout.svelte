<script lang="ts">
	import "../app.css";
	import { createWebSocketClient } from "$lib/api/websocket";
	import favicon from "$lib/assets/favicon.svg";
	import { Toaster } from "$lib/components/ui/sonner/index.js";
	import { DeviceService, setDeviceService } from "$lib/services/device.svelte";
	import { ModeWatcher } from "mode-watcher";
	import { onMount } from "svelte";

	let { children, data } = $props();

	const deviceService = new DeviceService();
	deviceService.hydrate(data.initialDevices || []);
	setDeviceService(deviceService);

	onMount(() => {
		const wsClient = createWebSocketClient();
		if (wsClient) {
			deviceService.startStreaming(wsClient);
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Toaster />
<ModeWatcher />
<div class="min-h-screen w-full">
	{@render children()}
</div>
