<script lang="ts">
	import { browser } from "$app/environment";
	import SignOut from "./sign-out.svelte";
	import Container from "./ui/container.svelte";

	const NAV_LINKS = [
		{ path: "/devices", label: "Devices" },
		{ path: "/tests", label: "Tests" }
	];

	if (browser) {
		const mobileNavToggle = document.querySelector("#mobile") as HTMLElement | null;
		const mobileNav = document.querySelector("#mobileNav") as HTMLElement | null;
		mobileNavToggle?.addEventListener("click", () => {
			mobileNav?.classList.toggle("hidden");
		});
	}
</script>

<div class="hidden h-full w-full border-b border-border md:block">
	<Container>
		<div class="flex flex-row items-center justify-between">
			<a href="/" class="text-3xl font-bold">Meter Lab</a>
			<div class="mr-5 flex flex-row items-center justify-center gap-5 text-lg">
				{#each NAV_LINKS as link (link.path)}
					<a href={`${link.path}`}>{link.label}</a>
				{/each}
				<SignOut />
			</div>
		</div>
	</Container>
</div>

<div class="relative block h-full w-full border-b border-border md:hidden">
	<Container>
		<div class="flex flex-row items-center justify-between">
			<a href="/" class="text-3xl font-bold">Meter Lab</a>
			<div class="mr-2 text-xl">
				<div id="mobile">☰</div>
			</div>
		</div>
		<div
			id="mobileNav"
			class="absolute top-full right-0 left-0 z-10 flex hidden flex-col gap-5 border-t border-border p-5 text-lg"
		>
			{#each NAV_LINKS as link (link.path)}
				<a href={`${link.path}`}>{link.label}</a>
			{/each}
			<SignOut />
		</div>
	</Container>
</div>
