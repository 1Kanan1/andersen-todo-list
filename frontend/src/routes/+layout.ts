import { PUBLIC_API_BASE_URL } from "$env/static/public";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ url, fetch }) => {
  // Avoid processing tokens for auth routes
  if (url.pathname.startsWith("/auth")) {
    return {};
  }

  if (!sessionStorage.getItem("access")) {
    const res = await fetch(`${PUBLIC_API_BASE_URL}/api/token/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const { access } = await res.json();
    sessionStorage.setItem("access_token", access);
  }

  return {};
};
