<script lang="ts">
	import * as Card from "$lib/components/ui/card/index.js";
	import Skeleton from "../ui/skeleton/skeleton.svelte";
</script>

<Card.Root class="gap-4">
	<Card.Header>
		<Card.Description>
			<Skeleton class="h-4 w-1/2 rounded" />
		</Card.Description>
		<Card.Title>
			<Skeleton class="h-[1.40625rem] w-full rounded" />
		</Card.Title>
	</Card.Header>
	<Card.Content>
		<Skeleton class="h-5 w-18 rounded-full" />
	</Card.Content>
</Card.Root>
