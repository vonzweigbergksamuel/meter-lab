<script lang="ts">
  import { cn } from "@/utils";

  let { className = "", children } = $props()
</script>

<div class={cn("mx-auto h-full w-full p-4 2xl:max-w-[2000px]", className)}>
  {@render children()}
</div>

