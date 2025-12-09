<script lang="ts">
	import * as Card from "$lib/components/ui/card/index.js";
	import Skeleton from "../ui/skeleton/skeleton.svelte";
</script>

<Card.Root
	class="w-60 max-w-sm border-slate-200 bg-linear-to-br from-slate-50 to-slate-100 transition-all duration-300 hover:border-slate-300 hover:shadow-lg"
>
	<Card.Content class="">
		<div class="space-y-2">
			<p class="text-xs font-semibold tracking-wider text-slate-500 uppercase">Device ID</p>
			<Skeleton class="h-9 w-full rounded bg-slate-300" />
		</div>
		<div class="flex items-center gap-3 pt-2">
			<div class="flex items-center gap-2">
				<Skeleton class="h-2.5 w-2.5 rounded-full bg-slate-300" />
				<Skeleton class="h-5 w-20 rounded bg-slate-300" />
			</div>
		</div>
	</Card.Content>
</Card.Root>
