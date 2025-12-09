<script lang="ts">
	import { cn } from "@/utils";

	let { className = "", children } = $props();
</script>

<div class={cn("mx-auto h-full w-full max-w-7xl p-4", className)}>
	{@render children()}
</div>
