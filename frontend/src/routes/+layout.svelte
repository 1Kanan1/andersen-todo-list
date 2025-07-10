<script lang="ts">
    import { page } from "$app/state";
    import "../app.css";

    import * as NavigationMenu from "$lib/components/ui/navigation-menu/index.js";
    import { navigationMenuTriggerStyle } from "$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte";

    let { children } = $props();
</script>

<div
    class="relative flex flex-col items-center justify-center h-dvh px-4 py-12"
>
    {#if page.url.pathname !== "/auth"}
        <div class="absolute w-full flex justify-center top-0 left-0">
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
                        <NavigationMenu.Link
                            href="/logout"
                            class={navigationMenuTriggerStyle()}
                            >Logout
                        </NavigationMenu.Link>
                    </NavigationMenu.Item>
                </NavigationMenu.List>
            </NavigationMenu.Root>
        </div>
    {/if}
    {@render children()}
</div>
