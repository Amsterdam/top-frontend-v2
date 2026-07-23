import { useCallback } from "react"
import { useAuth } from "react-oidc-context"
import { apiFetch, type ApiFetchOptions } from "./apiFetch"

/**
 * Token-bound fetcher for use as a TanStack Query queryFn/mutationFn, since
 * queryFn isn't a component and can't call useAuth() itself.
 */
export const useApiFetch = () => {
  const auth = useAuth()
  const token = auth.user?.access_token

  return useCallback(
    <Schema>(url: string, options: Omit<ApiFetchOptions, "token"> = {}) =>
      apiFetch<Schema>(url, { ...options, token }),
    [token],
  )
}
