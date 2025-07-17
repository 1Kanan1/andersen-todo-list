import { API_BASE_URL } from "$env/static/private";
import type { RequestHandler } from "./$types";
import { json, error, type Cookies } from "@sveltejs/kit";

export const POST: RequestHandler = async ({
  params,
  fetch,
  cookies,
}: {
  params: any;
  fetch: any;
  cookies: Cookies;
}) => {
  const { id } = params;

  if (!id) {
    throw error(400, { message: "Missing task ID" });
  }

  try {
    const res = await fetch(`${API_BASE_URL}/tasks/${id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.get("access_token")}`,
      },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(JSON.stringify(error));
    }
    return json({ success: true }, { status: 200 });
  } catch (err: any) {
    throw error(400, { message: JSON.parse(err.message) });
  }
};
