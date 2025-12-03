<script lang="ts">
 import * as Card from "$lib/components/ui/card/index.js";
 import { cn } from "$lib/utils.js";

  interface Props {
    device_id: string
    device_status: "available" | "under_test"
  }

  const statusSpinnerColors = {
    available: "bg-emerald-500",
    under_test: "bg-orange-400",
  };

  const statusTextColors = {
    available: "text-emerald-600",
    under_test: "text-orange-400",
  };

  const statusLabels = {
    available: "Available",
    under_test: "Under test",
  };

  let { device_id, device_status }: Props = $props()
</script>

<Card.Root class="w-full max-w-sm bg-linear-to-br from-slate-50 to-slate-100 border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all duration-300">
  <Card.Content class="">
    <div class="space-y-2">
      <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Device ID</p>
      <p class="text-sm font-mono text-slate-700 bg-slate-200 rounded px-3 py-2 break-all">{ device_id }</p>
    </div>
    <div class="flex items-center gap-3 pt-2">
      <div class="flex items-center gap-2">
        <span class={cn("w-2.5 h-2.5 rounded-full animate-pulse", statusSpinnerColors[device_status])}></span>
        <span class={cn("text-sm font-semibold", statusTextColors[device_status])}>{ statusLabels[device_status] }</span>
      </div>
    </div>
  </Card.Content>
</Card.Root>