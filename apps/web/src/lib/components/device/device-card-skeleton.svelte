<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import { cn } from "$lib/utils.js";
  import Skeleton from "../ui/skeleton/skeleton.svelte";
</script>

<Card.Root class="w-60 max-w-sm bg-linear-to-br from-slate-50 to-slate-100 border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all duration-300">
  <Card.Content class="">
    <div class="space-y-2">
      <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Device ID</p>
      <Skeleton class="h-9 w-full rounded bg-slate-300" />
    </div>
    <div class="flex items-center gap-3 pt-2">
      <div class="flex items-center gap-2">
        <Skeleton class="w-2.5 h-2.5 rounded-full bg-slate-300" />
        <Skeleton class="h-5 w-20 rounded bg-slate-300" />
      </div>
    </div>
  </Card.Content>
</Card.Root>