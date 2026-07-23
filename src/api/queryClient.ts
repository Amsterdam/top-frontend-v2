import { QueryCache, QueryClient, MutationCache } from "@tanstack/react-query"
import { normalizeApiError } from "@/api/utils/normalizeApiError"
import { mapApiErrorToAlert } from "@/api/utils/mapApiErrorToAlert"
import { showAlertOutsideReact } from "@/components/alerts/alertBridge"

const handleApiError = (error: unknown) => {
  showAlertOutsideReact(mapApiErrorToAlert(normalizeApiError(error)))
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 60_000,
    },
  },
  queryCache: new QueryCache({ onError: handleApiError }),
  mutationCache: new MutationCache({ onError: handleApiError }),
})
