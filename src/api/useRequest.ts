import { useCallback } from "react"
import { useAuth } from "react-oidc-context"

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

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      return (await response.json()) as Schema
    },
    [token],
  )
}

export default useRequest
