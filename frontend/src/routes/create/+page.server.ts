import type { Actions } from "./$types";
import { fail, redirect } from "@sveltejs/kit";

import type { PageServerLoad } from "./$types";

import { superValidate } from "sveltekit-superforms";
import { createSchema } from "./schema";
import { zod4 } from "sveltekit-superforms/adapters";
import { create } from "$lib/api.server";

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod4(createSchema)),
  };
};

export const actions = {
  default: async ({ request, fetch, cookies }) => {
    const form = await superValidate(request, zod4(createSchema));

    if (!form.valid) {
      return fail(400, { createForm: form });
    }

    try {
      await create(form, fetch, cookies);
    } catch (err: any) {
      let errors;
      try {
        errors = JSON.parse(err.message);
      } catch {
        form.errors._errors = [errors];
        return fail(400, { createForm: form });
      }
      if (errors.detail) form.errors._errors = [errors.detail];
      return fail(400, { createForm: form });
    }

    throw redirect(303, "/");
  },
} satisfies Actions;
