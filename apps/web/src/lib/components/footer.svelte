<script lang="ts">
	import Container from "./ui/container.svelte";

	const date = new Date().getFullYear();
</script>

<div>
	<Container className="flex flex-row">
		<div class="mr-auto ml-0">© {date} Meter lab</div>
		<div class="mr-0 ml-auto">
			Website by <a class="hover:text-gray-500" href="https://codesquare.dev/">CODESQUARE</a>
		</div>
	</Container>
</div>
