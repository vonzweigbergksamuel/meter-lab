<script lang="ts">
	import { cn } from "$lib/utils.js";

	interface Props {
		status: "available" | "under_test";
	}

	let { status }: Props = $props();
</script>

<div class="flex items-center gap-2">
	<span
		class={cn(
			"h-2.5 w-2.5 animate-pulse rounded-full",
			status === "available" ? "bg-emerald-500" : "bg-orange-400"
		)}
	></span>
	<span
		class={cn(
			"text-sm font-semibold",
			status === "available" ? "text-emerald-600" : "text-orange-400"
		)}>{status === "available" ? "Available" : "Under test"}</span
	>
</div>
