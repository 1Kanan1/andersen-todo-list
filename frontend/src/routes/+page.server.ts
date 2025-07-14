import type { PageServerLoad } from "./$types";
import * as z from "zod";

import { getTasks } from "$lib/api.server";
import { error } from "@sveltejs/kit";

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  status: z.enum(["New", "In Progress", "Completed", "All"]).default("All"),
});

export const load: PageServerLoad = async ({ url, cookies }) => {
  const query = querySchema.safeParse({
    page:
      url.searchParams.get("page") === null
        ? undefined
        : Number(url.searchParams.get("page")),
    status: url.searchParams.get("status") ?? undefined,
  });

  if (!query.success) {
    throw error(400, { message: "Invalid query parameters" });
  }

  const { page, status } = query.data;

  try {
    const response = await getTasks(cookies, { page, status });
    return {
      page,
      status,
      count: response.count,
      tasks: response.results,
    };
  } catch (err: any) {
    throw error(500, { message: "Failed to fetch tasks" });
  }
};
