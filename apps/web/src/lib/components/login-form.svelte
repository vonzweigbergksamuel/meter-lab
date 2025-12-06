<script lang="ts">
	import { authClient } from "$lib/auth-client";
	import { Button } from "$lib/components/ui/button/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import {
		Field,
		FieldDescription,
		FieldGroup,
		FieldLabel
	} from "$lib/components/ui/field/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { cn } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let { class: className, ...restProps }: HTMLAttributes<HTMLDivElement> = $props();

	const id = $props.id();

	const handleSubmit = async (e: Event) => {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;
		const { data, error } = await authClient.signIn.email({
			email: email,
			password: password,
			callbackURL: "/dashboard"
		});
		if (error) {
			console.error("error", error);
		}
		if (data) {
			console.log("data", data);
		}
	};
</script>

<div class={cn("flex flex-col gap-6", className)} {...restProps}>
	<Card.Root>
		<Card.Header class="text-center text-pretty">
			<Card.Title class="text-xl">Logga in</Card.Title>
			<Card.Description
				>Fyll i din e-postadress nedan för att logga in på ditt konto</Card.Description
			>
		</Card.Header>
		<Card.Content>
			<form onsubmit={handleSubmit}>
				<FieldGroup>
					<Field>
						<FieldLabel for="email-{id}">E-postadress</FieldLabel>
						<Input id="email-{id}" name="email" type="email" placeholder="m@example.com" required />
					</Field>
					<Field>
						<div class="flex items-center">
							<FieldLabel for="password-{id}">Lösenord</FieldLabel>
						</div>
						<Input id="password-{id}" name="password" type="password" required />
					</Field>
					<Field>
						<Button type="submit">Logga in</Button>
						<FieldDescription class="text-center">
							Har du inget konto? <span class="text-primary">Kontakta en administratör</span>
						</FieldDescription>
					</Field>
				</FieldGroup>
			</form>
		</Card.Content>
	</Card.Root>
	<FieldDescription class="px-6 text-center">
		Genom att klicka på logga in, godkänner du våra <a href="##">Användarvillkor</a> och
		<a href="##">Integritetspolicy</a>.
	</FieldDescription>
</div>
