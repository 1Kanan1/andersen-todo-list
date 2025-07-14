import { NODE_ENV } from "$env/static/private";
import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ cookies }) => {
  cookies.delete("access_token", {
    httpOnly: true,
    path: "/",
    secure: NODE_ENV === "production",
  });
  cookies.delete("refresh_token", {
    httpOnly: true,
    path: "/",
    secure: NODE_ENV === "production",
  });

  throw redirect(303, "/auth/login");
};
