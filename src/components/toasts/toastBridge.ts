import type { ToastMessage } from "./types"

type ShowToast = (toast: Omit<ToastMessage, "id">) => void

/**
 * Lets code outside the React tree (e.g. the QueryClient's global error
 * handlers, which run before any component renders) trigger the same toasts
 * as useToast(). ToastProvider registers itself here on mount.
 */
let showToastImpl: ShowToast | null = null

export const registerToastBridge = (showToast: ShowToast) => {
  showToastImpl = showToast
}

export const showToastOutsideReact: ShowToast = (toast) => {
  showToastImpl?.(toast)
}
