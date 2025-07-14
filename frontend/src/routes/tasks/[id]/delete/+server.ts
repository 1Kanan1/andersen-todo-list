// src/routes/tasks/[id]/delete/+page.server.ts
import type { RequestHandler } from "./$types";
import { deleteTask } from "$lib/api.server";
import { json, error, type Cookies } from "@sveltejs/kit";

export const POST: RequestHandler = async ({
  params,
  cookies,
}: {
  params: any;
  cookies: Cookies;
}) => {
  const { id } = params;

  if (!id) {
    throw error(400, { message: "Missing task ID" });
  }

  try {
    await deleteTask(cookies, Number(id));
    return json({ success: true }, { status: 200 });
  } catch (err: any) {
    throw error(400, { message: JSON.parse(err.message) });
  }
};
