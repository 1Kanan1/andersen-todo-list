<script lang="ts">
    import type { PageProps } from "./$types";

    import * as Alert from "$lib/components/ui/alert/index";
    import * as Form from "$lib/components/ui/form/index";
    import { Input } from "$lib/components/ui/input/index";
    import Icon from "@iconify/svelte";
    import { setError, superForm } from "sveltekit-superforms";
    import { zod4Client } from "sveltekit-superforms/adapters";
    import { loginSchema } from "../schema";
    import { PUBLIC_API_BASE_URL } from "$env/static/public";

    let { data }: PageProps = $props();

    const form = superForm(data.form, {
        validators: zod4Client(loginSchema),
        SPA: true,
        onUpdate: async ({ form: validated, result }) => {
            if (!validated.valid) return;
            try {
                const res = await fetch(`${PUBLIC_API_BASE_URL}/api/token/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(validated.data),
                });

                if (!res.ok) {
                    const error = await res.json().catch(() => ({}));
                    throw new Error(JSON.stringify(error));
                }

                const { access } = await res.json();
                sessionStorage.setItem("access_token", access);
            } catch (err: any) {
                const parsed = JSON.parse(err.message || "{}");
                if (parsed.detail) {
                    result.type = "failure";
                    setError(validated, "", parsed.detail);
                }
            }
        },
    });

    const { form: formData, enhance, errors } = form;

    let showPassword = $state(false);
</script>

<svelte:head>
    <title>Sign in</title>
</svelte:head>

<form use:enhance class="space-y-4">
    <Form.Field {form} name="username" class="mt-2">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label>Username</Form.Label>
                <div class="relative mt-1 rounded-md shadow-sm">
                    <Input
                        {...props}
                        placeholder="Username"
                        bind:value={$formData.username}
                    />
                </div>
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="password" class="mt-2">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label>Password</Form.Label>
                <div class="relative mt-1 rounded-md shadow-sm">
                    <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...props}
                        bind:value={$formData.password}
                    />
                    <button
                        type="button"
                        onclick={() => {
                            showPassword = !showPassword;
                        }}
                        class="absolute inset-y-0 right-0 z-10 flex items-center pr-3 text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                        {#if showPassword}
                            <Icon
                                icon="mdi:eye-off"
                                width="20"
                                height="20"
                                aria-hidden="true"
                            />
                        {:else}
                            <Icon
                                icon="mdi:eye"
                                width="20"
                                height="20"
                                aria-hidden="true"
                            />
                        {/if}
                    </button>
                </div>
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>

    <!-- Form-level errors -->
    {#if $errors._errors}
        <Alert.Root variant="destructive" class="shadow-sm">
            <Icon icon="lucide:circle-alert" width="24" height="24" />
            <Alert.Description>{$errors._errors[0]}</Alert.Description>
        </Alert.Root>
    {/if}

    <!-- Submit button -->
    <Form.Button class="w-full">Sign in</Form.Button>
</form>
