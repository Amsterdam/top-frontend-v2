import { useState, useCallback, useEffect, useRef } from "react"
import { useApiCache } from "./useApiCache"
import { useAuth } from "react-oidc-context"
import { makeApiUrl } from "./utils/makeApiUrl"
import stringifyQueryParams from "./utils/stringifyQueryParams"

type Method = "GET" | "POST" | "PATCH" | "DELETE"

interface RequestOptions<TPayload> {
  payload?: TPayload
  params?: Record<string, string | number | string[] | undefined>
  pathParams?: Array<string | number | undefined>
}

export const useApi = <TResponse, TPayload = unknown>(
  path: string,
  autoFetch = true,
) => {
  const cache = useApiCache()
  const { user } = useAuth()
  const token = user?.access_token

  const [data, setData] = useState<TResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<unknown>(null)

  const fetchStartedRef = useRef(false)

  const buildUrl = useCallback(
    (options?: RequestOptions<TPayload>) => {
      const fullPath = makeApiUrl(path, ...(options?.pathParams || []))
      if (!options?.params) return fullPath
      return `${fullPath}${stringifyQueryParams(options.params)}`
    },
    [path],
  )

  const request = useCallback(
    async (method: Method, options: RequestOptions<TPayload> = {}) => {
      const url = buildUrl(options)

      if (method === "GET" && cache.has(url)) {
        const cached = cache.get(url) as TResponse
        setData(cached)
        return cached
      }

      try {
        setLoading(true)
        setError(null)

        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        }

        if (token) headers["Authorization"] = `Bearer ${token}`

        const response = await fetch(url, {
          method,
          headers,
          body:
            method === "GET" || method === "DELETE"
              ? undefined
              : JSON.stringify(options.payload),
        })

        if (!response.ok) throw new Error("Request failed")

        const result = (await response.json()) as TResponse

        if (method === "GET") {
          cache.set(url, result)
          setData(result)
        }

        return result
      } catch (err) {
        setError(err)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [buildUrl, cache, token],
  )

  useEffect(() => {
    if (autoFetch && !fetchStartedRef.current) {
      fetchStartedRef.current = true
      request("GET").catch(() => null)
    }
  }, [autoFetch, request])

  return { data, loading, error, request }
}
