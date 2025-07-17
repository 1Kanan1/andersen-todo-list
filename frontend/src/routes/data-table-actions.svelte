<script lang="ts">
  import EllipsisIcon from "@lucide/svelte/icons/ellipsis";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { goto, invalidateAll } from "$app/navigation";
  import { fail } from "@sveltejs/kit";

  let { id }: { id: string } = $props();

  async function handleDelete() {
    try {
      const response = await fetch(`/tasks/${id}/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete task");
      }

      await invalidateAll(); // refreshes the data
    } catch (err: any) {
      fail(400, { errors: JSON.parse(err.message) });
    }
  }
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Button
        {...props}
        variant="ghost"
        size="icon"
        class="relative size-8 p-0"
      >
        <span class="sr-only">Open menu</span>
        <EllipsisIcon />
      </Button>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Group>
      <DropdownMenu.Item onclick={() => goto(`/tasks/${id}`)}
        >Info</DropdownMenu.Item
      >
      <DropdownMenu.Item onclick={() => goto(`/tasks/${id}/update`)}
        >Update</DropdownMenu.Item
      >
      <DropdownMenu.Item onclick={handleDelete}>Delete</DropdownMenu.Item>
    </DropdownMenu.Group>
  </DropdownMenu.Content>
</DropdownMenu.Root>
