<script lang="ts">
    import type { PageProps } from "./$types";
    import { enhance } from "$app/forms";

    import Icon from "@iconify/svelte";

    let { data }: PageProps = $props();
    let tasks = data.tasks;
</script>

<svelte:head>
    <title>Tasks</title>
</svelte:head>

<div class="flex flex-col mx-auto max-w-xs border rounded-sm">
    <div class="flex w-full px-2 py-1.5 justify-between bg-gray-400">
        <strong>Task Name</strong>
        <div>Options</div>
    </div>
    {#each data.tasks as task}
        <div class="flex w-full px-2 py-1.5 justify-between">
            <strong>{task.title}</strong>
            <div class="flex gap-1">
                <a href="/tasks/{task.id}/">
                    <Icon
                        icon="heroicons:information-circle-16-solid"
                        width="24"
                        height="24"
                    />
                </a>
                <form
                    method="POST"
                    action="?/delete"
                    use:enhance={() => {
                        return async ({ update }) => {
                            await update();
                            tasks = tasks.filter(
                                (id: number) => id !== task.id,
                            );
                        };
                    }}
                >
                    <input type="hidden" name="id" value={task.id} />
                    <button
                        type="submit"
                        name="delete"
                        class="px-1 cursor-pointer"
                    >
                        <Icon icon="heroicons:trash" width="24" height="24" />
                    </button>
                </form>
            </div>
        </div>
    {/each}
</div>
