import { createContext, useContext } from "react"
import type { IconProps } from "@amsterdam/design-system-react"

export type VisitWrapperNotificationTone = "success" | "error" | "info"

export type VisitWrapperNotification = {
  tone: VisitWrapperNotificationTone
  label: string
  icon?: IconProps["svg"]
}

export type VisitWrapperNotificationApi = {
  pushNotification: (notification: VisitWrapperNotification) => void
  clearNotification: () => void
}

export const VisitWrapperNotificationContext =
  createContext<VisitWrapperNotificationApi | null>(null)

export const useVisitWrapperNotification = () =>
  useContext(VisitWrapperNotificationContext)
