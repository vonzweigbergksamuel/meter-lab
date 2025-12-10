<script lang="ts">
	import Container from "./ui/container.svelte";
	import ThemeToggle from "./ui/theme-toggle.svelte";

	const date = new Date().getFullYear();
</script>

<Container className="flex flex-row items-center justify-between self-end">
	<div>© {date} Meter lab</div>
	<div class="flex flex-row items-center gap-4">
		<p>Website by <a href="https://codesquare.dev/" target="_blank">CODESQUARE</a></p>
		<ThemeToggle />
	</div>
</Container>
