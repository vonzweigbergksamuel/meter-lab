<script lang="ts">
	import HeroText from "@/components/hero-text.svelte";
	import { Button } from "@/components/ui/button";
	import Container from "@/components/ui/container.svelte";
	import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
	import { Input } from "@/components/ui/input";
	import { cn } from "@/utils";
	import { createQuery } from "@tanstack/svelte-query";
	import { browser } from "$app/environment";
	import { rpc } from "$lib/api/client";
	import * as Select from "$lib/components/ui/select/index.js";
	import { toast } from "svelte-sonner";
	import { createTest } from "./data.remote";

	const { title, description, testType, devices } = createTest.fields;

	const devicesQuery = browser
		? createQuery(() =>
				rpc.device.queryOptions({
					input: {},
					context: { cache: false }
				})
			)
		: null;

	const availableDevices = $derived(
		devicesQuery?.data?.devices?.filter((d) => d.device_status === "available") || []
	);

	const testTypes = [
		{ value: "alive", label: "Alive Test" },
		{ value: "stress", label: "Stress Test" }
	];

	// State for the form
	let selectedTestType = $state<string | undefined>(undefined);
	let selectedDevices = $state<string[]>([]);

	// Props for the form
	const testTypeProps = testType.as("select");
	const devicesProps = devices.as("select multiple");

	const triggerContent = $derived(
		testTypes.find((t) => t.value === selectedTestType)?.label ?? "Select a test type"
	);

	const devicesTriggerContent = $derived(
		selectedDevices.length > 0 ? `${selectedDevices.length} device(s) selected` : "Select devices"
	);
</script>

<Container className="mt-8">
	<HeroText title="Create test" />

	<form
		{...createTest.enhance(async ({ form, submit }) => {
			await submit();

			if (createTest.result?.success) {
				// TODO: Get test id from backend and show it in the toast
				toast.success(`Test ${4} created successfully`, { position: "top-center" });
				form.reset();
				selectedTestType = undefined;
				selectedDevices = [];
			}
		})}
		class="mt-8 max-w-2xl"
	>
		<FieldGroup>
			<Field class="relative">
				<FieldLabel for="title">Title</FieldLabel>
				<Input {...title.as("text")} id="title" placeholder="Enter test title" />
				{#each title.issues() as issue}
					<p class="absolute -bottom-4 text-xs text-destructive">{issue.message}</p>
				{/each}
			</Field>

			<Field class="relative">
				<FieldLabel for="description">Description</FieldLabel>
				<Input {...description.as("text")} id="description" placeholder="Enter test description" />
				{#each description.issues() as issue}
					<p class="absolute -bottom-4 text-xs text-destructive">{issue.message}</p>
				{/each}
			</Field>

			<Field class="relative">
				<FieldLabel for="testType">Test Type</FieldLabel>
				<input type="hidden" name={testTypeProps.name} value={selectedTestType ?? ""} />
				<Select.Select bind:value={selectedTestType} type="single">
					<Select.SelectTrigger
						class={cn(
							(testType.issues()?.length ?? 0) > 0 ? "aria-invalid border-destructive" : ""
						)}
					>
						{triggerContent}
					</Select.SelectTrigger>
					<Select.SelectContent>
						<Select.SelectGroup>
							<Select.SelectLabel>Select a test type</Select.SelectLabel>
							{#each testTypes as type (type.value)}
								<Select.SelectItem value={type.value} label={type.label} />
							{/each}
						</Select.SelectGroup>
					</Select.SelectContent>
				</Select.Select>
				{#each testType.issues() as issue}
					<p class="absolute -bottom-4 text-xs text-destructive">{issue.message}</p>
				{/each}
			</Field>

			<Field class="relative">
				<FieldLabel for="devices">Select Devices</FieldLabel>
				{#if !browser || !devicesQuery}
					<div class="text-sm text-muted-foreground">Loading devices...</div>
				{:else if devicesQuery?.isLoading}
					<div class="text-sm text-muted-foreground">Loading devices...</div>
				{:else if devicesQuery?.error}
					<div class="text-sm text-destructive">Error loading devices</div>
				{:else if availableDevices.length === 0}
					<div class="text-sm text-muted-foreground">No available devices</div>
				{:else}
					{#each selectedDevices as device}
						<input type="hidden" name={devicesProps.name} value={device} />
					{/each}
					<Select.Select bind:value={selectedDevices} type="multiple">
						<Select.SelectTrigger
							class={cn(
								(devices.issues()?.length ?? 0) > 0 ? "aria-invalid border-destructive" : ""
							)}
						>
							{devicesTriggerContent}
						</Select.SelectTrigger>
						<Select.SelectContent>
							{#each availableDevices as device (device.device_id)}
								<Select.SelectItem value={device.device_id} label={device.device_id} />
							{/each}
						</Select.SelectContent>
					</Select.Select>
				{/if}
				{#each devices.issues() as issue}
					<p class="absolute -bottom-4 text-xs text-destructive">{issue.message}</p>
				{/each}
			</Field>

			<Field>
				<Button type="submit" disabled={!browser || availableDevices.length === 0}>
					Create Test
				</Button>
			</Field>
		</FieldGroup>
	</form>
</Container>
