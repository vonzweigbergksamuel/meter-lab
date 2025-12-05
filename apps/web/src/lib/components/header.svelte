<script lang="ts">
  import { browser } from "$app/environment";
	import Container from "./ui/container.svelte";

  const NAV_LINKS = [
    { path: "/test-cases", label: "Test Cases"},
    { path: "/test-runs", label: "Test Runs"}
  ]

  if (browser) {
    const mobileNavToggle = document.querySelector("#mobile") as HTMLElement | null
    const mobileNav = document.querySelector("#mobileNav") as HTMLElement | null
    mobileNavToggle?.addEventListener("click", () => {
      mobileNav?.classList.toggle("hidden")
    })
  }

</script>

<div class="w-full h-full bg-blue-500 hidden md:block">
  <Container>
    <div class="flex flex-row justify-between items-center">
      <!-- Maybe a img with a cool font? -->
      <a href="/" class="text-white text-3xl">Meter Lab</a>
      <div class="flex flex-row gap-5 text-white text-xl mr-5">
        {#each NAV_LINKS as link (link.path)}
          <a class="hover:text-blue-800" href={link.path}>{link.label}</a>
        {/each}
      </div>
    </div>
  </Container>
</div>

<div class="w-full h-full bg-blue-500 md:hidden block">
  <Container>
    <div class="flex flex-row justify-between items-center">
      <a href="/" class="text-white text-3xl">Meter Lab</a>
      <div class="text-white text-xl mr-2">
        <div class="text-white" id="mobile">
          ☰
        </div>
      </div>
    </div>
    <div id="mobileNav" class="flex flex-col gap-5 text-white text-xl mr-5 mt-5 hidden">
      {#each NAV_LINKS as link (link.path)}
        <a class="hover:text-blue-800" href={link.path}>{link.label}</a>
      {/each}
    </div>
  </Container>
</div>