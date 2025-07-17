<script lang="ts">
  import { page } from "$app/state";

  import * as Card from "$lib/components/ui/card/index";

  let { children } = $props();
</script>

<svelte:head>
  <title>{page.url.pathname === "/signup" ? "Sign up" : "Sign in"}</title>
</svelte:head>

<Card.Root class="w-full max-w-sm space-y-6 rounded-lg p-6 shadow-xl sm:p-8">
  <Card.Header>
    {#if page.url.pathname === "/auth/login"}
      <Card.Title
        class="text-center text-2xl sm:text-3xl font-semibold tracking-tight"
      >
        Welcome Back!
      </Card.Title>
      <Card.Description class="mt-2 text-center text-sm">
        Sign in to continue to TODO List
      </Card.Description>
    {:else}
      <Card.Title
        class="text-center text-2xl sm:text-3xl font-semibold tracking-tight"
      >
        Create your Account
      </Card.Title>
      <Card.Description class="mt-2 text-center text-sm">
        Already have an account?
        <a href="/auth/login" class="font-extrabold"> Sign in </a>
      </Card.Description>
    {/if}
  </Card.Header>
  <Card.Content>
    {@render children()}
  </Card.Content>
  <Card.Footer class="flex flex-col">
    {#if page.url.pathname === "/auth/login"}
      <p class="mt-8 text-center text-sm">
        Don't have an account?
        <a href="/auth/signup" class="font-extrabold"> Sign up now </a>
      </p>
    {/if}
  </Card.Footer>
</Card.Root>
