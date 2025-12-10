<script lang="ts">
	import * as Card from "$lib/components/ui/card/index.js";
	import { Badge } from "../ui/badge";

	interface Props {
		device_id: string;
		device_status: "available" | "under_test";
	}

	let { device_id, device_status }: Props = $props();
</script>

<Card.Root class="gap-4">
	<Card.Header>
		<Card.Description class="text-xs font-light tracking-wide uppercase">device id</Card.Description
		>
		<Card.Title class="text-lg/tight">
			{device_id}
		</Card.Title>
	</Card.Header>
	<Card.Content>
		<!-- <Status status={device_status} /> for now we use a badge -->
		<Badge variant={device_status === "available" ? "default" : "warning"}>
			{device_status === "available" ? "Available" : "Under testing"}
		</Badge>
	</Card.Content>
</Card.Root>
