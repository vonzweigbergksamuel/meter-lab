<script lang="ts">
	import Container from "./ui/container.svelte";
	import ThemeToggle from "./ui/theme-toggle.svelte";

	const date = new Date().getFullYear();
</script>

<Container className="flex flex-row items-center justify-between">
	<div>© {date} Meter Lab</div>
	<div class="flex flex-row items-center gap-4">
		<p>
			Service by <a href="https://codesquare.dev/" class="hover:text-[#5c8772cc]" target="_blank"
				>CODESQUARE</a
			>
		</p>
		<ThemeToggle />
	</div>
</Container>
