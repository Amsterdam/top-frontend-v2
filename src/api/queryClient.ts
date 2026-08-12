import { QueryCache, QueryClient, MutationCache } from "@tanstack/react-query"
import { normalizeApiError } from "@/api/utils/normalizeApiError"
import { mapApiErrorToAlert } from "@/api/utils/mapApiErrorToAlert"
import { showAlertOutsideReact } from "@/components/alerts/alertBridge"

/**
 * Meta options queries/mutations can pass to opt out of the global error
 * alert, e.g. `useQuery({ ..., meta: { globalErrorAlert: false } })`.
 * Use this for queries whose errors are already shown inline (e.g. in a
 * Card via its `error` prop) so the user doesn't see the same failure twice.
 */
declare module "@tanstack/react-query" {
  interface Register {
    queryMeta: {
      globalErrorAlert?: boolean
    }
    mutationMeta: {
      globalErrorAlert?: boolean
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
      if (query.meta?.globalErrorAlert === false) return
      showAlertOutsideReact(mapApiErrorToAlert(normalizeApiError(error)))
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      if (mutation.meta?.globalErrorAlert === false) return
      showAlertOutsideReact(mapApiErrorToAlert(normalizeApiError(error)))
    },
  }),
})
