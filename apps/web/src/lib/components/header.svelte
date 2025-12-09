<script lang="ts">
	import { browser } from "$app/environment";
	import Signout from "./signout.svelte";
	import Container from "./ui/container.svelte";

  const NAV_LINKS = [
    { path: "/devices", label: "Devices"},
    { path: "/tests", label: "Tests"}
  ]

	if (browser) {
		const mobileNavToggle = document.querySelector("#mobile") as HTMLElement | null;
		const mobileNav = document.querySelector("#mobileNav") as HTMLElement | null;
		mobileNavToggle?.addEventListener("click", () => {
			mobileNav?.classList.toggle("hidden");
		});
	}
</script>

<div class="w-full h-full bg-white border shadow-xs hidden md:block">
  <Container>
    <div class="flex flex-row justify-between items-center">
      <!-- Maybe a img with a cool font? -->
      <a href="/devices" class="text-black text-3xl font-bold">Meter Lab</a>
      <div class="flex flex-row gap-5 justify-center items-center text-black text-lg mr-5">
        {#each NAV_LINKS as link (link.path)}
          <a class="hover:text-gray-500" href={`${link.path}`}>{link.label}</a>
        {/each}
        <Signout />
      </div>
    </div>
  </Container>
</div>

<div class="w-full h-full bg-white border shadow-xs md:hidden block relative">
  <Container>
    <div class="flex flex-row justify-between items-center">
      <a href="/devices" class="text-black text-3xl font-bold">Meter Lab</a>
      <div class="text-black text-xl mr-2">
        <div class="text-black" id="mobile">
          ☰
        </div>
      </div>
    </div>
    <div id="mobileNav" class="absolute top-full left-0 right-0 bg-white border-t shadow-lg flex flex-col gap-5 text-black text-lg p-5 hidden z-10">
      {#each NAV_LINKS as link (link.path)}
        <a class="hover:text-gray-500" href={`${link.path}`}>{link.label}</a>
      {/each}
      <Signout />
    </div>
  </Container>
</div>
