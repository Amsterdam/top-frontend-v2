import { useEffect } from "react"
import { useRegisterSW } from "virtual:pwa-register/react"
import { useToast } from "@/components/toasts/useToast"

// registerType is "prompt" in vite.config.ts: the new service worker
// installs but waits until updateServiceWorker() is called, so the app can
// ask the user first instead of silently swapping the running app under
// them mid-task (e.g. while filling in a visit form).
export function usePwaUpdatePrompt() {
  const { showToast } = useToast()
  const { needRefresh, updateServiceWorker } = useRegisterSW()
  const [isUpdateAvailable] = needRefresh

  useEffect(() => {
    if (!isUpdateAvailable) return

    showToast({
      title: "Nieuwe versie beschikbaar",
      description: "Er is een update van TOP beschikbaar.",
      action: {
        label: "Vernieuwen",
        onClick: () => {
          void updateServiceWorker(true)
        },
      },
    })
  }, [isUpdateAvailable, showToast, updateServiceWorker])
}
