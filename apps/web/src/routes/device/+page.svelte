<script lang="ts">
  import DeviceCard from "@/components/device-card.svelte";
</script>

<div class="flex flex-col items-center w-ful">
  <div class="flex flex-row gap-4 justify-start items-center my-5 mx-auto">
    <DeviceCard deviceId="58940943276521354" status="available" />
    <DeviceCard deviceId="12345678901234567" status="unavailable" />
    <DeviceCard deviceId="99999999999999999" status="error" />
  </div>
</div>