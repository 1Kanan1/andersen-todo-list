import type { PageServerLoad } from "../$types";
import { error } from "@sveltejs/kit";

import { getTask } from "$lib/api.server";

export const load: PageServerLoad = async ({ cookies, params }) => {
  const { id } = params;

  try {
    const response = await getTask(cookies, Number(id));
    const { title, description, status } = response;
    return { title, description, status };
  } catch (err: any) {
    throw error(500, { message: `Failed to fetch a task (id: ${id})` });
  }
};
