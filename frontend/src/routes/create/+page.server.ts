import type { Actions } from "./$types";
import { fail, redirect } from "@sveltejs/kit";

import { createTask } from "$lib/api.server";
import type { PageServerLoad } from "../$types";

import { superValidate } from "sveltekit-superforms";
import { createSchema } from "./schema";
import { zod4 } from "sveltekit-superforms/adapters";

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod4(createSchema)),
  };
};

export const actions = {
  create: async ({ request, cookies }) => {
    const form = await superValidate(request, zod4(createSchema));

    if (!form.valid) {
      return fail(400, { createForm: form });
    }

    try {
      await createTask(cookies, form.data);
    } catch (err: any) {
      const errors = JSON.parse(err.message);
      if (errors.detail) {
        form.errors._errors = [errors.detail];
      }
      return fail(400, { createForm: form });
    }

    throw redirect(303, "/");
  },
} satisfies Actions;
