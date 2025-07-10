<script lang="ts">
    import { enhance } from "$app/forms";
    import type { PageProps } from "../$types";

    import * as Card from "$lib/components/ui/card/index";
    import { Button } from "$lib/components/ui/button/index";
    import { Input } from "$lib/components/ui/input/index";
    import { Label } from "$lib/components/ui/label/index";

    let { form }: PageProps = $props();
</script>

<Card.Root class="w-full max-w-sm">
    <Card.Header>
        <Card.Title>Create Task</Card.Title>
    </Card.Header>
    <Card.Content>
        <form method="POST" action="?/create" use:enhance>
            <div class="flex flex-col gap-6">
                <div class="grid gap-2">
                    <Label for="title">Title</Label>
                    <Input name="title" type="text" required />
                </div>
                <div class="grid gap-2">
                    <Label for="description">Description</Label>
                    <Input name="description" type="text" required />
                </div>
                <div class="grid gap-2">
                    <Label for="status">Status</Label>
                    <Input name="description" type="text" required />
                </div>
            </div>
        </form>
    </Card.Content>
    <Card.Footer>
        <Button type="submit" class="w-full">Create</Button>
    </Card.Footer>
</Card.Root>
