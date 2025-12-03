<script lang="ts">
  import DeviceCard from "@/components/device-card.svelte";
</script>

<div class="flex flex-col items-center w-ful">
  <div class="flex flex-row gap-4 justify-start items-center my-5 mx-auto">
    <DeviceCard device_id="58940943276521354" device_status="available" />
    <DeviceCard device_id="12345678901234567" device_status="available" />
    <DeviceCard device_id="78236512782903486" device_status="under_test" />
  </div>
</div>