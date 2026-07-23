import type { ApiError } from "@/api/types/apiError"

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

export type ApiFetchOptions = {
  method?: HttpMethod
  data?: unknown
  token?: string
}

export async function apiFetch<Schema>(
  url: string,
  { method = "GET", data, token }: ApiFetchOptions = {},
): Promise<Schema> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  })

  const text = await response.text()
  let json: unknown
  try {
    json = text ? JSON.parse(text) : null
  } catch {
    json = text
  }

  if (!response.ok) {
    throw {
      status: response.status,
      message: typeof json === "string" ? json : response.statusText,
      ...(typeof json === "object" && json !== null ? json : {}),
    } as ApiError
  }

  return json as Schema
}
