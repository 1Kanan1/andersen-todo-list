import type { Actions } from "./$types";
import { error, fail, redirect } from "@sveltejs/kit";

import type { PageServerLoad } from "./$types";

import { superValidate } from "sveltekit-superforms";
import { taskSchema } from "../schema";
import { zod4 } from "sveltekit-superforms/adapters";
import { getTask, update } from "$lib/api.server";

export const load: PageServerLoad = async ({ fetch, cookies, params }) => {
  const { id } = params;

  try {
    const res = await getTask(id, fetch, cookies);
    return {
      form: await superValidate(res, zod4(taskSchema)), // response here is used to populate form
    };
  } catch (err: any) {
    throw error(500, { message: `Failed to fetch a task (id: ${id})` });
  }
};

export const actions = {
  default: async ({ request, fetch, cookies, params }) => {
    const { id } = params;
    const form = await superValidate(request, zod4(taskSchema));

    if (!form.valid) {
      return fail(400, { updateForm: form });
    }

    try {
      await update(id, form, fetch, cookies);
    } catch (err: any) {
      let errors;
      try {
        errors = JSON.parse(err.message);
      } catch {
        form.errors._errors = [errors];
        return fail(400, { updateForm: form });
      }
      if (errors.detail) form.errors._errors = [errors.detail];
      return fail(400, { updateForm: form });
    }

    throw redirect(303, "/");
  },
} satisfies Actions;
