import type { Actions } from "./$types";
import { fail, redirect } from "@sveltejs/kit";

import { signup } from "$lib/api.server";
import type { PageServerLoad } from "../$types";

import { superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import { signupSchema } from "../schema";

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod4(signupSchema)),
  };
};

export const actions = {
  signup: async ({ request }: { request: any }) => {
    const form = await superValidate(request, zod4(signupSchema));

    if (!form.valid) {
      return fail(400, { signupForm: form });
    }

    try {
      await signup(form.data);
    } catch (err: any) {
      const errors = JSON.parse(err.message);
      if (errors.username) form.errors._errors = [errors.username];
      return fail(400, { signupForm: form });
    }

    throw redirect(303, "/");
  },
} satisfies Actions;
