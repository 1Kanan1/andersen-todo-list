import type { LayoutServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: LayoutServerLoad = async ({ cookies, url }) => {
  // Avoid processing tokens for auth routes
  if (url.pathname.startsWith("/auth")) {
    return {};
  }

  const refresh = cookies.get("refresh_token");

  if (refresh) {
    return {};
  }

  if (!url.pathname.startsWith("/auth")) {
    throw redirect(303, "/auth/login");
  }
};
