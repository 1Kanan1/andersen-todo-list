import type { Actions } from "./$types";
import { fail, redirect } from "@sveltejs/kit";

import { login } from "$lib/api.server";
import type { PageServerLoad } from "../$types";

import { superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import { loginSchema } from "../schema";

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod4(loginSchema)),
  };
};

export const actions = {
  login: async ({ request, cookies }: { request: any; cookies: any }) => {
    const form = await superValidate(request, zod4(loginSchema));

    if (!form.valid) {
      return fail(400, { loginForm: form });
    }

    try {
      await login(cookies, form.data);
    } catch (err: any) {
      const errors = JSON.parse(err.message);
      if (errors.detail) {
        form.errors._errors = [errors.detail];
      }
      return fail(400, { loginForm: form });
    }

    throw redirect(303, "/");
  },
} satisfies Actions;
