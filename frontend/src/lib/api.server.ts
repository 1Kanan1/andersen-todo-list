import type { Cookies } from "@sveltejs/kit";
import { VITE_API_BASE_URL, NODE_ENV } from "$env/static/private";

export async function request(
  method: string,
  endpoint: string,
  cookies?: Cookies,
  data?: any,
) {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (cookies) {
    const token = cookies.get("access_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const response: Response = await fetch(`${VITE_API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });

  if (response.status === 204) {
    return null;
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(JSON.stringify(error));
  }

  return response.json();
}

export async function signup(data: {
  first_name: string;
  username: string;
  password: string;
  last_name?: string;
}) {
  return request("POST", "/users/register/", undefined, data);
}

export async function login(
  cookies: Cookies,
  data: { username: string; password: string },
) {
  const response = await request("POST", "/api/token/", undefined, data);
  cookies.set("access_token", response.access, {
    path: "/",
    httpOnly: true,
    secure: NODE_ENV === "production",
    maxAge: 60 * 30, // 60 seconds * 30 minutes = 30 minutes
  });
  cookies.set("refresh_token", response.refresh, {
    path: "/",
    httpOnly: true,
    secure: NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 60 seconds * 60 minutes * 24 hours = 1 day
  });
  return response;
}

export async function createTask(
  cookies: Cookies,
  data: {
    title: string;
    description?: string;
    status?: "New" | "In Progress" | "Completed";
  },
) {
  return request("POST", "/tasks/", cookies, data);
}

export async function getTasks(
  cookies: Cookies,
  params: {
    page: number;
    status?: "New" | "In Progress" | "Completed" | "All";
  },
) {
  const endpoint =
    params.status !== "All"
      ? `/tasks/?page=${params.page}&status=${params.status}`
      : `/tasks/?page=${params.page}`;
  return request("GET", endpoint, cookies);
}

export async function getTask(cookies: Cookies, id: number) {
  return request("GET", `/tasks/${id}/`, cookies);
}

export async function updateTask(
  cookies: Cookies,
  id: number,
  data: {
    title?: string;
    description?: string;
    status?: "New" | "In Progress" | "Completed";
  },
) {
  return request("PUT", `/tasks/${id}/`, cookies, data);
}

export async function deleteTask(cookies: Cookies, id: number) {
  return request("DELETE", `/tasks/${id}/`, cookies);
}
