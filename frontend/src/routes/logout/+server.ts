import { NODE_ENV } from "$env/static/private";
import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = ({ cookies }: { cookies: any }) => {
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
