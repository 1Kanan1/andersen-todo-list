import type { Actions } from "./$types";
import { fail, redirect } from "@sveltejs/kit";

import { login, signup } from "$lib/api.server";
import type { PageServerLoad } from "../$types";

export const load: PageServerLoad = async ({ cookies }) => {
  const refresh = cookies.get("refresh_token");
  if (refresh) {
    throw redirect(303, "/");
  }

  return {};
};

export const actions = {
  login: async ({ request, cookies }: { request: any; cookies: any }) => {
    const data = await request.formData();
    const username = data.get("username") as string;
    const password = data.get("password") as string;

    try {
      await login(cookies, { username, password });
    } catch (err: any) {
      return fail(400, { errors: JSON.parse(err.message) || undefined });
    }

    throw redirect(303, "/");
  },
  signup: async ({ request, cookies }: { request: any; cookies: any }) => {
    const data = await request.formData();
    const first_name = data.get("first_name") as string;
    const last_name = (data.get("last_name") as string) || undefined;
    const username = data.get("username") as string;
    const password = data.get("password") as string;

    try {
      await signup({ first_name, username, password, last_name });
    } catch (err: any) {
      return fail(400, { errors: JSON.parse(err.message) || undefined });
    }

    throw redirect(303, "/");
  },
} satisfies Actions;
