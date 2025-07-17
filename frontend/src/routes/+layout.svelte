<script lang="ts">
  import { page } from "$app/state";
  import "../app.css";
  import { ModeWatcher, toggleMode } from "mode-watcher";
  import * as NavigationMenu from "$lib/components/ui/navigation-menu/index.js";
  import { navigationMenuTriggerStyle } from "$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte";
  import Icon from "@iconify/svelte";
  import { Button } from "$lib/components/ui/button/index.js";

  let { children } = $props();
</script>

<ModeWatcher />
<div
  class="relative flex flex-col items-center justify-center h-dvh px-4 py-12"
>
  <div class="absolute w-full flex justify-center top-0 left-0">
    <div class="relative flex justify-center w-full max-w-sm">
      {#if !page.url.pathname.startsWith("/auth")}
        <NavigationMenu.Root viewport={false} class="mt-4 text-md">
          <NavigationMenu.List>
            <NavigationMenu.Item>
              <NavigationMenu.Link
                href="/"
                class={navigationMenuTriggerStyle()}
              >
                Tasks
              </NavigationMenu.Link>
            </NavigationMenu.Item>
            <NavigationMenu.Item>
              <NavigationMenu.Link
                href="/create"
                class={navigationMenuTriggerStyle()}
                >Create
              </NavigationMenu.Link>
            </NavigationMenu.Item>
            <NavigationMenu.Item>
              <form method="POST" action="/logout">
                <button
                  type="submit"
                  class={navigationMenuTriggerStyle()}
                  class:cursor-pointer={true}>Logout</button
                >
              </form>
            </NavigationMenu.Item>
          </NavigationMenu.List>
        </NavigationMenu.Root>
      {/if}
      <Button
        onclick={toggleMode}
        variant="outline"
        size="icon"
        class="absolute top-0 right-0 mt-4 mr-4"
      >
        <Icon
          icon="lucide:sun"
          width="none"
          class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 !transition-all dark:-rotate-90 dark:scale-0"
        />
        <Icon
          icon="lucide:moon"
          width="none"
          class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 !transition-all dark:rotate-0 dark:scale-100"
        />
        <span class="sr-only">Toggle theme</span>
      </Button>
    </div>
  </div>
  {@render children()}
</div>
