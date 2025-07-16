import { redirect } from "@sveltejs/kit";

import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ cookies }) => {
  const refresh = cookies.get("refresh_token");
  if (refresh) {
    throw redirect(303, "/");
  }

  return {};
};
