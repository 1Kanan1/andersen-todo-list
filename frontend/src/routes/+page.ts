import type { PageLoad } from "./$types";
import * as z from "zod";

import { error } from "@sveltejs/kit";
import { PUBLIC_API_BASE_URL } from "$env/static/public";

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  status: z.enum(["New", "In Progress", "Completed", "All"]).default("All"),
});

export const ssr = false;

export const load: PageLoad = async ({ url, fetch }) => {
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
    const res = await fetch(`${PUBLIC_API_BASE_URL}/tasks/?${searchParams}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
      },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw error(JSON.stringify(error));
    }

    const data = await res.json();

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
