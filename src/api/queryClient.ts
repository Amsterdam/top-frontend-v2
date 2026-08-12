import { QueryCache, QueryClient, MutationCache } from "@tanstack/react-query"
import { normalizeApiError } from "@/api/utils/normalizeApiError"
import { mapApiErrorToToast } from "@/api/utils/mapApiErrorToToast"
import { showToastOutsideReact } from "@/components/toasts/toastBridge"

/**
 * Meta options queries/mutations can pass to opt out of the global error
 * toast, e.g. `useQuery({ ..., meta: { globalErrorToast: false } })`.
 * Use this for queries whose errors are already shown inline (e.g. in a
 * Card via its `error` prop) so the user doesn't see the same failure twice.
 */
declare module "@tanstack/react-query" {
  interface Register {
    queryMeta: {
      globalErrorToast?: boolean
    }
    mutationMeta: {
      globalErrorToast?: boolean
    }
  }
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 300_000,
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (query.meta?.globalErrorToast === false) return
      showToastOutsideReact(mapApiErrorToToast(normalizeApiError(error)))
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      if (mutation.meta?.globalErrorToast === false) return
      showToastOutsideReact(mapApiErrorToToast(normalizeApiError(error)))
    },
  }),
})
