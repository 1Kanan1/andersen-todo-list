<script lang="ts">
  import type { PageProps } from "../$types";

  import * as Alert from "$lib/components/ui/alert/index";
  import * as Card from "$lib/components/ui/card/index";
  import * as Form from "$lib/components/ui/form/index";
  import * as Select from "$lib/components/ui/select/index.js";
  import { Input } from "$lib/components/ui/input/index";
  import Icon from "@iconify/svelte";

  import { superForm } from "sveltekit-superforms";
  import { zod4Client } from "sveltekit-superforms/adapters";
  import { createSchema } from "./schema";

  let { data }: PageProps = $props();

  const form = superForm(data.form, {
    validators: zod4Client(createSchema),
  });

  const { form: formData, enhance, errors } = form;
</script>

<svelte:head>
  <title>Create</title>
</svelte:head>

<Card.Root class="w-full max-w-sm">
  <Card.Header>
    <Card.Title>Create Task</Card.Title>
  </Card.Header>
  <Card.Content>
    <form method="POST" use:enhance>
      <Form.Field {form} name="title" class="mt-2">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Title</Form.Label>
            <Input {...props} bind:value={$formData.title} type="text" />
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field {form} name="description" class="mt-2">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Description</Form.Label>
            <Input {...props} bind:value={$formData.description} type="text" />
          {/snippet}
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field {form} name="status" class="mt-2">
        <Form.Control>
          {#snippet children({ props })}
            <Form.Label>Status</Form.Label>
            <Select.Root type="single" {...props} bind:value={$formData.status}>
              <Select.Trigger class="w-[180px]">
                {$formData.status}
              </Select.Trigger>
              <Select.Content>
                <Select.Group>
                  <Select.Label>Fruits</Select.Label>
                  {#each ["New", "In Progress", "Completed"] as status}
                    <Select.Item value={status} label={status}>
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
      <Form.Button class="w-full mt-8">Create</Form.Button>
    </form>
  </Card.Content>
</Card.Root>
