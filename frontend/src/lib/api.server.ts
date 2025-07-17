import { API_BASE_URL } from "$env/static/private";
import type { Cookies } from "@sveltejs/kit";
import type { SuperValidated } from "sveltekit-superforms";

async function apiCall(
  fetch: any,
  method: string,
  url: string,
  data?: any,
  cookies?: Cookies,
): Promise<any> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (cookies) {
    headers["Authorization"] = `Bearer ${cookies.get("access_token")}`;
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (data) options.body = JSON.stringify(data);

  const res = await fetch(`${API_BASE_URL}${url}`, options);

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(JSON.stringify(error));
  }

  return res.json();
}

export async function login(
  form: SuperValidated<
    {
      username: string;
      password: string;
    },
    any,
    {
      username: string;
      password: string;
    }
  >,
  fetch: any,
) {
  return apiCall(fetch, "POST", "/api/token/", form.data);
}

export async function signup(
  form: SuperValidated<
    {
      username: string;
      password: string;
    },
    any,
    {
      username: string;
      password: string;
    }
  >,
  fetch: any,
) {
  return apiCall(fetch, "POST", "/users/register/", form.data);
}

export async function create(
  form: SuperValidated<
    {
      title: string;
      status: "New" | "In Progress" | "Completed";
      description?: string | undefined;
    },
    any,
    {
      title: string;
      description?: string | undefined;
      status?: "New" | "In Progress" | "Completed" | undefined;
    }
  >,
  fetch: any,
  cookies: Cookies,
) {
  return apiCall(fetch, "POST", "/tasks/", form.data, cookies);
}

export async function update(
  id: string,
  form: SuperValidated<
    {
      title: string;
      status: "New" | "In Progress" | "Completed";
      description?: string | undefined;
    },
    any,
    {
      title: string;
      description?: string | undefined;
      status?: "New" | "In Progress" | "Completed" | undefined;
    }
  >,
  fetch: any,
  cookies: Cookies,
) {
  return apiCall(fetch, "PUT", `/tasks/${id}/`, form.data, cookies);
}

export async function getTask(id: string, fetch: any, cookies: Cookies) {
  return apiCall(fetch, "GET", `/tasks/${id}/`, undefined, cookies);
}

export async function getTasks(
  searchParams: URLSearchParams,
  fetch: any,
  cookies: Cookies,
) {
  return apiCall(fetch, "GET", `/tasks/?${searchParams}`, undefined, cookies);
}
