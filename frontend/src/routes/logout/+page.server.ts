import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ cookies }) => {
  cookies.delete("refresh_token", {
    httpOnly: true,
    path: "/",
    secure: true,
  });

  throw redirect(303, "/auth/login");
};
