<script lang="ts">
  import { cn } from "@/utils";

  let { className = "", children } = $props()
</script>

<div class={cn("mx-auto h-full w-full p-4 max-w-7xl", className)}>
  {@render children()}
</div>

