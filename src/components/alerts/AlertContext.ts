import { createContext } from "react"
import type { AlertMessage } from "./types"

export type AlertContextValue = {
  showAlert: (alert: Omit<AlertMessage, "id">) => void
  dismissAlert: (id: string) => void
}

export const AlertContext = createContext<AlertContextValue | null>(null)
