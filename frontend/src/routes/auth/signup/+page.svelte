<script lang="ts">
  import type { PageProps } from "./$types";

  import * as Alert from "$lib/components/ui/alert/index";
  import * as Form from "$lib/components/ui/form/index";
  import { Input } from "$lib/components/ui/input/index";
  import Icon from "@iconify/svelte";
  import { superForm } from "sveltekit-superforms";
  import { zod4Client } from "sveltekit-superforms/adapters";
  import { passwordRules, signupSchema } from "../schema";

  let { data }: PageProps = $props();

  const form = superForm(data.form, {
    validators: zod4Client(signupSchema),
  });

  const { form: formData, enhance, errors } = form;

  let showPassword = $state(false);

  const messages = $derived(
    passwordRules.map((req: any) => ({
      message: req.message,
      isValid: req.isValid($formData.password),
    })),
  );
</script>

<svelte:head>
  <title>Sign up</title>
</svelte:head>

<form method="POST" use:enhance class="space-y-4">
  <Form.Field {form} name="first_name" class="mt-2">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>First Name</Form.Label>
        <div class="relative mt-1 rounded-md shadow-sm">
          <div
            class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
          >
            <Icon
              icon="lucide:user"
              width="20"
              height="20"
              aria-hidden="true"
            />
          </div>
          <Input
            {...props}
            placeholder="First Name"
            bind:value={$formData.first_name}
            class="pl-10"
          />
        </div>
      {/snippet}
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Field {form} name="last_name" class="mt-2">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label
          >Last Name <span class="font-bold">(Optional)</span></Form.Label
        >
        <div class="relative mt-1 rounded-md shadow-sm">
          <div
            class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
          >
            <Icon
              icon="lucide:user"
              width="20"
              height="20"
              aria-hidden="true"
            />
          </div>
          <Input
            {...props}
            placeholder="Last Name"
            bind:value={$formData.last_name}
            class="pl-10"
          />
        </div>
      {/snippet}
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Field {form} name="username" class="mt-2">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Username</Form.Label>
        <div class="relative mt-1 rounded-md shadow-sm">
          <div
            class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
          >
            <Icon
              icon="lucide:user"
              width="20"
              height="20"
              aria-hidden="true"
            />
          </div>
          <Input
            {...props}
            placeholder="Username"
            bind:value={$formData.username}
            class="pl-10"
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
          <div
            class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
          >
            <Icon
              icon="lucide:lock"
              width="20"
              height="20"
              aria-hidden="true"
            />
          </div>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            {...props}
            bind:value={$formData.password}
            class="pl-10"
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
              <Icon icon="mdi:eye" width="20" height="20" aria-hidden="true" />
            {/if}
          </button>
        </div>
      {/snippet}
    </Form.Control>
    {#if $errors.password}
      <Alert.Root variant="destructive" class="flex flex-col shadow-sm">
        <Alert.Title>Password must include:</Alert.Title>
        <Alert.Description>
          <ul>
            {#each messages as error}
              <li
                class={{
                  "flex items-center gap-1": true,
                  "text-primary/60": error.isValid,
                }}
              >
                {#if error.isValid}
                  <Icon
                    icon="material-symbols:check-circle-outline-rounded"
                    width="16"
                    height="16"
                  />
                {:else}
                  <Icon
                    icon="material-symbols:cancel-outline"
                    width="16"
                    height="16"
                  />
                {/if}
                {error.message}
              </li>
            {/each}
          </ul>
        </Alert.Description>
      </Alert.Root>
    {/if}
  </Form.Field>

  <!-- Form-level errors -->
  {#if $errors._errors}
    <Alert.Root variant="destructive" class="shadow-sm">
      <Icon icon="lucide:circle-alert" width="24" height="24" />
      <Alert.Description>{$errors._errors[0]}</Alert.Description>
    </Alert.Root>
  {/if}

  <!-- Submit button -->
  <Form.Button class="w-full">Create Account</Form.Button>
</form>
