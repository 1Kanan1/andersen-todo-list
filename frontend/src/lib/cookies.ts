import { NODE_ENV } from "$env/static/private";
import type { Cookies } from "@sveltejs/kit";

export async function setCookies(
  cookies: Cookies,
  name: string,
  value: string,
) {
  const payload = JSON.parse(
    Buffer.from(value.split(".")[1], "base64").toString(),
  );

  cookies.set(name, value, {
    path: "/",
    httpOnly: true,
    secure: NODE_ENV === "production",
    maxAge: payload.exp - Math.floor(Date.now() / 1000),
  });
}
