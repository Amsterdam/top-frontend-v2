import { useCallback } from "react"
import { useAuth } from "react-oidc-context"
import type { ApiError } from "@/api/types/apiError"

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

export type RequestOptions = {
  protected?: boolean
  headers?: Record<string, string>
}

export const useRequest = () => {
  const auth = useAuth()
  const token = auth.user?.access_token

  return useCallback(
    async <Schema>(
      method: HttpMethod,
      url: string,
      data?: unknown,
      options: RequestOptions = {},
    ): Promise<Schema> => {
      const { protected: isProtected = false, headers = {} } = options

      const requestHeaders: HeadersInit = {
        "Content-Type": "application/json",
        ...headers,
      }

      if (isProtected && token) {
        requestHeaders.Authorization = `Bearer ${token}`
      }

      const response = await fetch(url, {
        method,
        headers: requestHeaders,
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

export default useRequest
