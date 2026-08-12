import { createContext } from "react"
import type { ToastMessage } from "./types"

export type ToastContextValue = {
  showToast: (toast: Omit<ToastMessage, "id">) => void
  dismissToast: (id: string) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)
