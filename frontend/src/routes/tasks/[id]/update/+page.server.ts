import type { Actions } from "./$types";
import { error, fail, redirect } from "@sveltejs/kit";

import { getTask, updateTask } from "$lib/api.server";
import type { PageServerLoad } from "../$types";

import { superValidate } from "sveltekit-superforms";
import { taskSchema } from "../schema";
import { zod4 } from "sveltekit-superforms/adapters";

export const load: PageServerLoad = async ({ cookies, params }) => {
  const { id } = params;

  try {
    const response = await getTask(cookies, Number(id));
    return {
      form: await superValidate(response, zod4(taskSchema)), // response here is used to populate form
    };
  } catch (err: any) {
    throw error(500, { message: `Failed to fetch a task (id: ${id})` });
  }
};

export const actions = {
  update: async ({ request, cookies, params }) => {
    const { id } = params;
    const form = await superValidate(request, zod4(taskSchema));

    if (!form.valid) {
      return fail(400, { updateForm: form });
    }

    try {
      await updateTask(cookies, Number(id), form.data);
    } catch (err: any) {
      const errors = JSON.parse(err.message);
      if (errors.detail) {
        form.errors._errors = [errors.detail];
      }
      return fail(400, { updateForm: form });
    }

    throw redirect(303, "/");
  },
} satisfies Actions;
