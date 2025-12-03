<script lang="ts">
 import * as Card from "$lib/components/ui/card/index.js";
</script>

<Card.Root class="w-full max-w-sm bg-linear-to-br from-slate-50 to-slate-100 border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all duration-300">
  <Card.Content class="">
    <div class="space-y-2">
      <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Device ID</p>
      <p class="text-sm font-mono text-slate-700 bg-slate-200 rounded px-3 py-2 break-all">58940943276521354</p>
    </div>
    <div class="flex items-center gap-3 pt-2">
      <div class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
        <span class="text-sm font-semibold text-emerald-600">Available</span>
      </div>
    </div>
  </Card.Content>
</Card.Root>