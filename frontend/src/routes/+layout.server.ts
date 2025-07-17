import { API_BASE_URL } from "$env/static/private";
import { setCookies } from "$lib/cookies";
import type { LayoutServerLoad } from "./$types";
import { error, redirect } from "@sveltejs/kit";

export const load: LayoutServerLoad = async ({ cookies, fetch, url }) => {
  // Avoid processing tokens for auth routes
  if (url.pathname.startsWith("/auth")) {
    return {};
  }

  const access = cookies.get("access_token");

  if (!access) {
    const refresh = cookies.get("refresh_token");

    if (!refresh && !url.pathname.startsWith("/auth")) {
      throw redirect(303, "/auth/login");
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/token/refresh/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh }),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(JSON.stringify(error));
      }

      const { access } = await res.json();

      await setCookies(cookies, "access_token", access);
    } catch (err: any) {
      const errors = JSON.parse(err.message);
      error(400, { message: errors });
    }
  }

  return {};
};
