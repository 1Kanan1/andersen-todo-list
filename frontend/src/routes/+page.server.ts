import type { PageServerLoad } from "./$types";
import * as z from "zod";

import { error } from "@sveltejs/kit";
import { getTasks } from "$lib/api.server";

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  status: z.enum(["New", "In Progress", "Completed", "All"]).default("All"),
});

export const load: PageServerLoad = async ({
  parent,
  url,
  fetch,
  cookies,
}: {
  parent: any;
  url: any;
  fetch: any;
  cookies: any;
}) => {
  await parent();
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
  const searchParams = new URLSearchParams(
    status === "All" ? { page } : { page, status },
  );

  try {
    const data = await getTasks(searchParams, fetch, cookies);

    return {
      page,
      status,
      count: data.count,
      tasks: data.results,
    };
  } catch (err: any) {
    throw error(500, { message: "Failed to fetch tasks" });
  }
};
