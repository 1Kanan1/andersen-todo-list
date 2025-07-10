import type { Actions } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import { createTask } from "$lib/api.server";

export const actions = {
  create: async ({ request, cookies }) => {
    const data = await request.formData();
    const title = data.get("title") as string;
    const description = (data.get("description") as string) || undefined;
    const status = data.get("status") as "New" | "In Progress" | "Completed";

    try {
      await createTask(cookies, { title, description, status });
    } catch (err: any) {
      return fail(500, { errors: JSON.parse(err.message) || undefined });
    }

    throw redirect(303, "/");
  },
} satisfies Actions;
