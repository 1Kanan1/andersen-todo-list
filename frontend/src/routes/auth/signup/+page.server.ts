import type { Actions } from "./$types";
import { fail, redirect } from "@sveltejs/kit";

import type { PageServerLoad } from "./$types";

import { superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import { signupSchema } from "../schema";
import { signup } from "$lib/api.server";

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod4(signupSchema)),
  };
};

export const actions = {
  default: async ({ request, fetch }: { request: any; fetch: any }) => {
    const form = await superValidate(request, zod4(signupSchema));

    if (!form.valid) {
      return fail(400, { signupForm: form });
    }

    try {
      await signup(form, fetch);
    } catch (err: any) {
      let errors;
      try {
        errors = JSON.parse(err.message);
      } catch {
        form.errors._errors = [errors];
        return fail(400, { signUp: form });
      }
      if (errors.username) form.errors._errors = [errors.username];
      return fail(400, { signupForm: form });
    }

    throw redirect(303, "/");
  },
} satisfies Actions;
