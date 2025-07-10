<script lang="ts">
    import { page } from "$app/state";
    import { enhance } from "$app/forms";
    import type { PageProps } from "../$types";

    import * as Alert from "$lib/components/ui/alert/index";
    import * as Card from "$lib/components/ui/card/index";
    import { Button } from "$lib/components/ui/button/index";
    import { Input } from "$lib/components/ui/input/index";
    import { Label } from "$lib/components/ui/label/index";
    import Icon from "@iconify/svelte";

    let { form }: PageProps = $props();
    let mode = $derived(
        page.url.searchParams.get("mode") == "signup" ? "signup" : "login",
    );

    let showPassword = $state(false);
</script>

<svelte:head>
    <title>{mode === "signup" ? "Sign up" : "Sign in"}</title>
</svelte:head>

<Card.Root
    class="w-full max-w-sm space-y-6 rounded-lg bg-white p-6 shadow-xl sm:p-8"
>
    <Card.Header>
        {#if mode === "login"}
            <Card.Title
                class="text-center text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900"
            >
                Welcome Back!
            </Card.Title>
            <Card.Description class="mt-2 text-center text-sm text-gray-500">
                Sign in to continue to TODO List
            </Card.Description>
        {:else}
            <Card.Title
                class="text-center text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900"
            >
                Create your Account
            </Card.Title>
            <Card.Description class="mt-2 text-center text-sm text-gray-500">
                Already have an account?
                <a
                    href="/auth?mode=login"
                    class="font-medium text-orange-600 hover:text-orange-500"
                >
                    Sign in
                </a>
            </Card.Description>
        {/if}
    </Card.Header>
    <Card.Content>
        <form
            method="POST"
            use:enhance
            action={mode === "signup" ? "?/signup" : "?/login"}
            class="space-y-4"
        >
            {#if mode === "signup"}
                <div class="mt-2">
                    <Label for="first_name">First Name</Label>
                    <div class="relative mt-1 rounded-md shadow-sm">
                        <div
                            class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                        >
                            <Icon
                                icon="lucide:user"
                                width="20"
                                height="20"
                                class="text-gray-400"
                                aria-hidden="true"
                            />
                        </div>
                        <Input
                            type="text"
                            name="first_name"
                            placeholder="First Name"
                            class={{ "pl-10": mode === "signup" }}
                        />
                    </div>

                    {#if form?.errors?.first_name}
                        <Alert.Root
                            variant="destructive"
                            class="mt-2 py-0 border-0"
                        >
                            <Icon
                                icon="lucide:circle-alert"
                                width="24"
                                height="24"
                            />
                            <Alert.Description
                                >{form.errors.first_name}</Alert.Description
                            >
                        </Alert.Root>
                    {/if}
                </div>
                <div class="mt-2">
                    <Label for="last_name"
                        >Last Name <span class="text-gray-400">(Optional)</span
                        ></Label
                    >
                    <div class="relative mt-1 rounded-md shadow-sm">
                        <div
                            class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                        >
                            <Icon
                                icon="lucide:user"
                                width="20"
                                height="20"
                                class="text-gray-400"
                                aria-hidden="true"
                            />
                        </div>
                        <Input
                            type="text"
                            name="last_name"
                            placeholder="Last Name"
                            class={{ "pl-10": mode === "signup" }}
                        />
                    </div>

                    {#if form?.errors?.last_name}
                        <Alert.Root
                            variant="destructive"
                            class="mt-2 py-0 border-0"
                        >
                            <Icon
                                icon="lucide:circle-alert"
                                width="24"
                                height="24"
                            />
                            <Alert.Description
                                >{form.errors.last_name}</Alert.Description
                            >
                        </Alert.Root>
                    {/if}
                </div>
            {/if}
            <div class="mt-2">
                <Label for="username">Username</Label>
                <div class="relative mt-1 rounded-md shadow-sm">
                    <div
                        class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                        class:hidden={mode === "login"}
                    >
                        <Icon
                            icon="lucide:user"
                            width="20"
                            height="20"
                            class="text-gray-400"
                            aria-hidden="true"
                        />
                    </div>
                    <Input
                        type="text"
                        name="username"
                        placeholder="Username"
                        class={{ "pl-10": mode === "signup" }}
                    />
                </div>
                {#if form?.errors?.username}
                    <Alert.Root
                        variant="destructive"
                        class="mt-2 py-0 border-0"
                    >
                        <Icon
                            icon="lucide:circle-alert"
                            width="24"
                            height="24"
                        />
                        <Alert.Description
                            >{form.errors.username}</Alert.Description
                        >
                    </Alert.Root>
                {/if}
            </div>
            <div class="mt-2">
                <Label for="password">Password</Label>
                <div class="relative mt-1 rounded-md shadow-sm">
                    <div
                        class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                        class:hidden={mode === "login"}
                    >
                        <Icon
                            icon="lucide:lock"
                            width="20"
                            height="20"
                            class="text-gray-400"
                            aria-hidden="true"
                        />
                    </div>
                    <Input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="••••••••"
                        autocomplete="current-password"
                        class={{ "pl-10": mode === "signup" }}
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
                            <Icon
                                icon="mdi:eye"
                                width="20"
                                height="20"
                                aria-hidden="true"
                            />
                        {/if}
                    </button>
                </div>

                {#if form?.errors?.password}
                    <Alert.Root
                        variant="destructive"
                        class="mt-2 py-0 border-0"
                    >
                        <Icon
                            icon="lucide:circle-alert"
                            width="24"
                            height="24"
                        />
                        <Alert.Description
                            >{form.errors.password}</Alert.Description
                        >
                    </Alert.Root>
                {/if}
            </div>

            <!-- Error message -->
            {#if form?.errors?.detail}
                <Alert.Root variant="destructive" class="shadow-sm">
                    <Icon icon="lucide:circle-alert" width="24" height="24" />
                    <Alert.Description>{form.errors.detail}</Alert.Description>
                </Alert.Root>
            {/if}

            <!-- Submit button -->
            <Button type="submit" class="w-full"
                >{mode === "signup" ? "Create Account" : "Sign in"}</Button
            >
        </form>
    </Card.Content>
    <Card.Footer class="flex flex-col">
        {#if mode === "login"}
            <p class="mt-8 text-center text-sm text-gray-500">
                Don't have an account?
                <a
                    href="/auth?mode=signup"
                    class="font-medium text-orange-600 hover:text-orange-500"
                >
                    Sign up now
                </a>
            </p>
        {/if}
    </Card.Footer>
</Card.Root>
