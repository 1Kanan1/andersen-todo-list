import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

import { superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import { taskSchema } from "../schema";
import { PUBLIC_API_BASE_URL } from "$env/static/public";

export const ssr = false;

export const load: PageLoad = async ({ params, fetch }) => {
  const { id } = params;

  try {
    const res = await fetch(`${PUBLIC_API_BASE_URL}/tasks/${id}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
      },
      credentials: "include",
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw error(JSON.stringify(error));
    }

    return {
      form: await superValidate(await res.json(), zod4(taskSchema)), // response here is used to populate form
      id,
    };
  } catch (err: any) {
    throw error(500, { message: `Failed to fetch a task (id: ${id})` });
  }
};
