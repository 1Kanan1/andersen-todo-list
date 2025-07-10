import type { LayoutServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { NODE_ENV, VITE_API_BASE_URL } from "$env/static/private";

export const load: LayoutServerLoad = async ({ cookies, url }) => {
  const token = cookies.get("access_token");

  if (token) {
    return {};
  }

  const refresh = cookies.get("refresh_token");
  if (refresh) {
    const response = await fetch(`${VITE_API_BASE_URL}/api/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });

    if (response.ok) {
      const { access, refresh } = await response.json();
      cookies.set("access_token", access, {
        httpOnly: true,
        path: "/",
        secure: NODE_ENV === "production",
        maxAge: 60 * 30, // 60 seconds * 30 minutes = 30 minutes
      });

      throw redirect(303, url.pathname + url.search);
    }
  }

  cookies.delete("refresh_token", { path: "/" });

  if (url.pathname !== "/auth") {
    throw redirect(303, "/auth");
  }
};
