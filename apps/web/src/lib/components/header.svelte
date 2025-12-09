<script lang="ts">
	import { browser } from "$app/environment";
	import Signout from "./signout.svelte";
	import Container from "./ui/container.svelte";

	const NAV_LINKS = [
		{ path: "/test-cases", label: "Test Cases" },
		{ path: "/test-runs", label: "Test Runs" }
	];

	if (browser) {
		const mobileNavToggle = document.querySelector("#mobile") as HTMLElement | null;
		const mobileNav = document.querySelector("#mobileNav") as HTMLElement | null;
		mobileNavToggle?.addEventListener("click", () => {
			mobileNav?.classList.toggle("hidden");
		});
	}
</script>

<div class="hidden h-full w-full border bg-white shadow-xs md:block">
	<Container>
		<div class="flex flex-row items-center justify-between">
			<!-- Maybe a img with a cool font? -->
			<a href="/" class="text-3xl font-bold text-black">Meter Lab</a>
			<div class="mr-5 flex flex-row items-center justify-center gap-5 text-lg text-black">
				{#each NAV_LINKS as link (link.path)}
					<a class="hover:text-gray-500" href={`/dashboard${link.path}`}>{link.label}</a>
				{/each}
				<Signout />
			</div>
		</div>
	</Container>
</div>

<div class="relative block h-full w-full border bg-white shadow-xs md:hidden">
	<Container>
		<div class="flex flex-row items-center justify-between">
			<a href="/" class="text-3xl font-bold text-black">Meter Lab</a>
			<div class="mr-2 text-xl text-black">
				<div class="text-black" id="mobile">☰</div>
			</div>
		</div>
		<div
			id="mobileNav"
			class="absolute top-full right-0 left-0 z-10 flex hidden flex-col gap-5 border-t bg-white p-5 text-lg text-black shadow-lg"
		>
			{#each NAV_LINKS as link (link.path)}
				<a class="hover:text-gray-500" href={`/dashboard${link.path}`}>{link.label}</a>
			{/each}
			<Signout />
		</div>
	</Container>
</div>
