import type { AlertMessage } from "./types"

type ShowAlert = (alert: Omit<AlertMessage, "id">) => void

/**
 * Lets code outside the React tree (e.g. the QueryClient's global error
 * handlers, which run before any component renders) trigger the same alerts
 * as useAlert(). AlertProvider registers itself here on mount.
 */
let showAlertImpl: ShowAlert | null = null

export const registerAlertBridge = (showAlert: ShowAlert) => {
  showAlertImpl = showAlert
}

export const showAlertOutsideReact: ShowAlert = (alert) => {
  showAlertImpl?.(alert)
}
