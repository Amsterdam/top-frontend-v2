import { useEffect } from "react"
import { useAuth } from "react-oidc-context"
import {
  flushOfflineVisitQueue,
  OFFLINE_VISIT_QUEUE_EVENT,
} from "@/offline/visitSync"

export const useOfflineVisitSync = () => {
  const auth = useAuth()
  const accessToken = auth.user?.access_token

  useEffect(() => {
    if (!accessToken) return

    const sync = () => {
      void flushOfflineVisitQueue(accessToken)
    }

    sync()
    window.addEventListener("online", sync)
    window.addEventListener(OFFLINE_VISIT_QUEUE_EVENT, sync)

    return () => {
      window.removeEventListener("online", sync)
      window.removeEventListener(OFFLINE_VISIT_QUEUE_EVENT, sync)
    }
  }, [accessToken])
}
