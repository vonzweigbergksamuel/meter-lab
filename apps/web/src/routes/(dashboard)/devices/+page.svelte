<script lang="ts">
	import DeviceManager from "@/components/device/device-manager.svelte";
	import HeroText from "@/components/hero-text.svelte";
	import Container from "@/components/ui/container.svelte";
</script>

<Container className="mt-8">
	<HeroText title="Devices" />
	<DeviceManager />
</Container>
