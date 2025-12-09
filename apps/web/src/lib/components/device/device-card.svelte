<script lang="ts">
	import * as Card from "$lib/components/ui/card/index.js";
	import { cn } from "$lib/utils.js";

	interface Props {
		device_id: string;
		device_status: "available" | "under_test";
	}

	const statusSpinnerColors = {
		available: "bg-emerald-500",
		under_test: "bg-orange-400"
	};

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

<Card.Root
	class="max-w-sm min-w-60 border-slate-200 bg-linear-to-br from-slate-50 to-slate-100 transition-all duration-300 hover:border-slate-300 hover:shadow-lg"
>
	<Card.Content class="">
		<div class="space-y-2">
			<p class="text-xs font-semibold tracking-wider text-slate-500 uppercase">Device ID</p>
			<p class="rounded bg-slate-200 px-3 py-2 font-mono text-sm break-all text-slate-700">
				{device_id}
			</p>
		</div>
		<div class="flex items-center gap-3 pt-2">
			<div class="flex items-center gap-2">
				<span
					class={cn("h-2.5 w-2.5 animate-pulse rounded-full", statusSpinnerColors[device_status])}
				></span>
				<span class={cn("text-sm font-semibold", statusTextColors[device_status])}
					>{statusLabels[device_status]}</span
				>
			</div>
		</div>
	</Card.Content>
</Card.Root>
