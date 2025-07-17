import { getTask } from "$lib/api.server";
import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ cookies, fetch, params }) => {
  const { id } = params;

  try {
    return await getTask(id, fetch, cookies); // { title, description, status }
  } catch (err: any) {
    throw error(500, { message: `Failed to fetch a task (id: ${id})` });
  }
};
