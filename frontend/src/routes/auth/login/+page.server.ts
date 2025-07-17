import type { Actions } from "./$types";
import { fail, redirect } from "@sveltejs/kit";

import type { PageServerLoad } from "./$types";

import { superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import { loginSchema } from "../schema";
import { login } from "$lib/api.server";
import { setCookies } from "$lib/cookies";

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod4(loginSchema)),
  };
};

export const actions = {
  default: async ({
    request,
    cookies,
    fetch,
  }: {
    request: any;
    cookies: any;
    fetch: any;
  }) => {
    const form = await superValidate(request, zod4(loginSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    try {
      const { access, refresh } = await login(form, fetch);

      await setCookies(cookies, "access_token", access);
      await setCookies(cookies, "refresh_token", refresh);
    } catch (err: any) {
      let errors;
      try {
        errors = JSON.parse(err.message);
      } catch {
        form.errors._errors = [errors];
        return fail(400, { form });
      }
      if (errors.detail) form.errors._errors = [errors.detail];

      return fail(400, { form });
    }

    throw redirect(303, "/");
  },
} satisfies Actions;
