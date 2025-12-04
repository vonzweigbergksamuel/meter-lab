<script lang="ts">
  import { browser } from "$app/environment";

  const NAV_LINKS = [
    { path: "/", label: "Home"},
    { path: "/device", label: "Device"}
  ]

  if (browser) {
    const mobileNavToggle = document.querySelector("#mobile") as HTMLElement | null
    const mobileNav = document.querySelector("#mobileNav") as HTMLElement | null
    mobileNavToggle?.addEventListener("click", () => {
      mobileNav?.classList.toggle("hidden")
    })
  }

</script>

<div class="w-full h-full bg-blue-500 p-5 hidden md:block">
  <div class="flex flex-row justify-between items-center">
    <!-- Maybe a img with a cool font? -->
    <h1 class="text-white text-3xl">Meter Lab</h1>
    <div class="flex flex-row gap-5 text-white text-xl mr-5">
      {#each NAV_LINKS as link (link.path)}
        <a class="hover:text-blue-800" href={link.path}>{link.label}</a>
      {/each}
    </div>
  </div>
</div>

<div class="w-full h-full bg-blue-500 p-5 md:hidden block">
  <div class="flex flex-row justify-between items-center">
    <h1 class="text-white text-3xl">Meter Lab</h1>
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
</div>