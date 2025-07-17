<script lang="ts">
  import { goto } from "$app/navigation";

  import * as Card from "$lib/components/ui/card/index";
  import { Button } from "$lib/components/ui/button/index.js";

  let { data } = $props();
</script>

<svelte:head>
  <title>{data.title}</title>
</svelte:head>

<Card.Root class="w-full max-w-sm space-y-6 rounded-lg p-6 shadow-xl sm:p-8">
  <Card.Header>
    <Card.Title
      class="text-center text-2xl sm:text-3xl font-semibold tracking-tight"
    >
      {data.title}
    </Card.Title>
  </Card.Header>
  <Card.Content>
    <Card.Description class="mt-2 text-center text-sm">
      {data.description}
    </Card.Description>
  </Card.Content>
  <Card.Footer class="flex flex-col">
    <Button onclick={() => goto("/")}>Go back</Button>
  </Card.Footer>
</Card.Root>
