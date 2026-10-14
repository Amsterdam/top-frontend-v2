import { useCallback } from "react"
import { useAuth, type AuthContextProps } from "react-oidc-context"
import type { User } from "oidc-client-ts"
import type { ApiError } from "@/api/types/apiError"

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

export type ApiFetchOptions = {
  method?: HttpMethod
  data?: unknown
}

// Renew a bit before expiry, so a token can't expire while a request is in flight.
const EXPIRY_MARGIN_IN_SECONDS = 30

// Shared between all fetchers, so concurrent requests trigger a single renewal.
let pendingRenewal: Promise<User | null> | null = null

/**
 * Renews the token via the refresh token. The automatic silent renew of
 * oidc-client-ts only tries once, right before expiry, and can miss or fail
 * (backgrounded tab, frozen iOS PWA, flaky network). Without this, the
 * expired token keeps being sent and the API answers with 403s.
 */
const renewUser = (auth: AuthContextProps) => {
  pendingRenewal ??= auth
    .signinSilent()
    .catch((error: unknown) => {
      // Refresh token is no longer valid: the only way back is a new login.
      void auth.signinRedirect({
        url_state: window.location.pathname + window.location.search,
      })
      throw error
    })
    .finally(() => {
      pendingRenewal = null
    })

  return pendingRenewal
}

const isExpiring = (user: User) =>
  user.expires_in !== undefined && user.expires_in < EXPIRY_MARGIN_IN_SECONDS

/**
 * Token-bound fetcher for use as a TanStack Query queryFn/mutationFn, since
 * queryFn isn't a component and can't call useAuth() itself.
 */
export const useApiFetch = () => {
  const auth = useAuth()

  return useCallback(
    async <Schema>(
      url: string,
      { method = "GET", data }: ApiFetchOptions = {},
    ): Promise<Schema> => {
      // Offline, renewing can't work; the service worker may still answer from cache.
      const canRenew = navigator.onLine && !!auth.user

      let user = auth.user
      if (canRenew && user && isExpiring(user)) {
        user = await renewUser(auth)
      }

      const send = (token?: string) => {
        const headers: HeadersInit = {
          "Content-Type": "application/json",
        }

        if (token) {
          headers.Authorization = `Bearer ${token}`
        }

        return fetch(url, {
          method,
          headers,
          body: data ? JSON.stringify(data) : undefined,
        })
      }

      let response = await send(user?.access_token)

      // The API answers an expired token with a 403 (sometimes 401); renew once and retry.
      if (canRenew && (response.status === 401 || response.status === 403)) {
        user = await renewUser(auth)
        response = await send(user?.access_token)
      }

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
    [auth],
  )
}
