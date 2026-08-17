import { useCallback } from "react"
import { useAuth } from "react-oidc-context"
import type { ApiError } from "@/api/types/apiError"

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

export type ApiFetchOptions = {
  method?: HttpMethod
  data?: unknown
}

/**
 * Token-bound fetcher for use as a TanStack Query queryFn/mutationFn, since
 * queryFn isn't a component and can't call useAuth() itself.
 */
export const useApiFetch = () => {
  const auth = useAuth()
  const token = auth.user?.access_token

  return useCallback(
    async <Schema>(
      url: string,
      { method = "GET", data }: ApiFetchOptions = {},
    ): Promise<Schema> => {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      }

      if (token) {
        headers.Authorization = `Bearer ${token}`
      }

      const isMutatingRequest = method !== "GET"

      if (
        isMutatingRequest &&
        typeof navigator !== "undefined" &&
        !navigator.onLine
      ) {
        throw new TypeError("Failed to fetch")
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
    },
    [token],
  )
}
