<script lang="ts">
	import * as Card from "$lib/components/ui/card/index.js";
	import { cn } from "$lib/utils.js";

	interface Props {
		device_id: string;
		device_status: "available" | "under_test";
	}

	const statusTextColors = {
		available: "text-emerald-600",
		under_test: "text-orange-400"
	};

	const statusLabels = {
		available: "Available",
		under_test: "Under test"
	};

	let { device_id, device_status }: Props = $props();
</script>

<Card.Root class="gap-4">
	<Card.Header>
		<Card.Description class="text-xs uppercase">device id</Card.Description>
		<Card.Title>
			{device_id}
		</Card.Title>
	</Card.Header>
	<Card.Content>
		<div class="flex items-center gap-2">
			<span
				class={cn(
					"h-2.5 w-2.5 animate-pulse rounded-full",
					device_status === "available" ? "bg-emerald-500" : "bg-orange-400"
				)}
			></span>
			<span class={cn("text-sm font-semibold", statusTextColors[device_status])}
				>{statusLabels[device_status]}</span
			>
		</div>
	</Card.Content>
</Card.Root>
