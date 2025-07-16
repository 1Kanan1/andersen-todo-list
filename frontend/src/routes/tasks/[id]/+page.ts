import { PUBLIC_API_BASE_URL } from "$env/static/public";
import type { PageLoad } from "./$types";
import { error } from "@sveltejs/kit";

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
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw error(JSON.stringify(error));
    }

    const { title, description, status } = await res.json();
    return { title, description, status };
  } catch (err: any) {
    throw error(500, { message: `Failed to fetch a task (id: ${id})` });
  }
};
