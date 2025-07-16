<script lang="ts">
    import type { PageProps } from "../$types";

    import * as Alert from "$lib/components/ui/alert/index";
    import * as Card from "$lib/components/ui/card/index";
    import * as Form from "$lib/components/ui/form/index";
    import * as Select from "$lib/components/ui/select/index.js";
    import { Input } from "$lib/components/ui/input/index";
    import Icon from "@iconify/svelte";

    import { setError, superForm } from "sveltekit-superforms";
    import { zod4Client } from "sveltekit-superforms/adapters";
    import { taskSchema } from "../schema";
    import { goto } from "$app/navigation";
    import { PUBLIC_API_BASE_URL } from "$env/static/public";

    let { data }: PageProps = $props();

    const form = superForm(data.form, {
        validators: zod4Client(taskSchema),
        SPA: true,
        onUpdate: async ({ form: validated, result }) => {
            if (!validated.valid) return;
            try {
                const res = await fetch(
                    `${PUBLIC_API_BASE_URL}/tasks/${data.id}/`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
                        },
                        body: JSON.stringify(validated.data),
                    },
                );

                if (!res.ok) {
                    const error = await res.json().catch(() => ({}));
                    throw new Error(JSON.stringify(error));
                }

                await goto("/");
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
</script>

<svelte:head>
    <title>Update</title>
</svelte:head>

<Card.Root class="w-full max-w-sm">
    <Card.Header>
        <Card.Title>Create Task</Card.Title>
    </Card.Header>
    <Card.Content>
        <form use:enhance>
            <Form.Field {form} name="title" class="mt-2">
                <Form.Control>
                    {#snippet children({ props })}
                        <Form.Label>Title</Form.Label>
                        <Input
                            {...props}
                            bind:value={$formData.title}
                            type="text"
                        />
                    {/snippet}
                </Form.Control>
                <Form.FieldErrors />
            </Form.Field>
            <Form.Field {form} name="description" class="mt-2">
                <Form.Control>
                    {#snippet children({ props })}
                        <Form.Label>Description</Form.Label>
                        <Input
                            {...props}
                            bind:value={$formData.description}
                            type="text"
                        />
                    {/snippet}
                </Form.Control>
                <Form.FieldErrors />
            </Form.Field>
            <Form.Field {form} name="status" class="mt-2">
                <Form.Control>
                    {#snippet children({ props })}
                        <Form.Label>Status</Form.Label>
                        <Select.Root
                            type="single"
                            {...props}
                            bind:value={$formData.status}
                        >
                            <Select.Trigger class="w-[180px]">
                                {$formData.status}
                            </Select.Trigger>
                            <Select.Content>
                                <Select.Group>
                                    <Select.Label>Fruits</Select.Label>
                                    {#each ["New", "In Progress", "Completed"] as status}
                                        <Select.Item
                                            value={status}
                                            label={status}
                                        >
                                            {status}
                                        </Select.Item>
                                    {/each}
                                </Select.Group>
                            </Select.Content>
                        </Select.Root>
                    {/snippet}
                </Form.Control>
            </Form.Field>

            <!-- Form-level errors -->
            {#if $errors._errors}
                <Alert.Root variant="destructive" class="shadow-sm">
                    <Icon icon="lucide:circle-alert" width="24" height="24" />
                    <Alert.Description>{$errors._errors[0]}</Alert.Description>
                </Alert.Root>
            {/if}
            <Form.Button class="w-full mt-8">Update</Form.Button>
        </form>
    </Card.Content>
</Card.Root>
