import type { PageServerLoad } from "./$types";
import type { Actions } from "./$types";
import { fail } from "@sveltejs/kit";

import { createTask, deleteTask, getTasks } from "$lib/api.server";

export const load: PageServerLoad = async ({ url, cookies }) => {
  const status = url.searchParams.get("status") || undefined;
  const response = await getTasks(cookies, status);
  return {
    tasks: response.results,
  };
};

export const actions = {
  create: async ({ request, cookies }) => {
    const data = await request.formData();
    const title = data.get("title") as string;
    const description = data.get("description") as string;
    const status = "New" as "New" | "In Progress" | "Completed";

    try {
      await createTask(cookies, { title, description, status });
      return { success: true };
    } catch (err: any) {
      return JSON.parse(err.message);
    }
  },
  delete: async ({ request, cookies }) => {
    const data = await request.formData();
    const id = data.get("id");

    if (!id) {
      return fail(400, { error: "Missing task ID" });
    }

    try {
      await deleteTask(cookies, Number(id));
      return { success: true };
    } catch (err: any) {
      return fail(400, JSON.parse(err.message));
    }
  },
} satisfies Actions;
