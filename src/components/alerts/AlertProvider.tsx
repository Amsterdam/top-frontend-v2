import { useCallback, useEffect, useState } from "react"
import { Alert, Paragraph } from "@amsterdam/design-system-react"
import { AlertContext } from "./AlertContext"
import type { AlertMessage } from "./types"

const TIME_TOAST_DISMISS = 5000 // 5 seconds
const TIMEOUT_FADE_OUT = 500 // 0.5 seconds

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [alerts, setAlerts] = useState<AlertMessage[]>([])

  const showAlert = useCallback((alert: Omit<AlertMessage, "id">) => {
    const id = crypto.randomUUID()
    setAlerts((current) => [...current, { ...alert, id, visible: true }])

    setTimeout(() => {
      setAlerts((current) =>
        current.map((a) => (a.id === id ? { ...a, visible: false } : a)),
      )
    }, TIME_TOAST_DISMISS - TIMEOUT_FADE_OUT)
  }, [])

  const dismissAlert = useCallback((id: string) => {
    setAlerts((current) =>
      current.map((a) => (a.id === id ? { ...a, visible: false } : a)),
    )
  }, [])

  // Remove alerts that are not visible anymore
  useEffect(() => {
    const timer = setInterval(() => {
      setAlerts((current) => current.filter((a) => a.visible))
    }, TIMEOUT_FADE_OUT)
    return () => clearInterval(timer)
  }, [])

  return (
    <AlertContext.Provider value={{ showAlert, dismissAlert }}>
      {alerts.map((alert) => (
        <Alert
          key={alert.id}
          heading={alert.title}
          headingLevel={2}
          closeable
          onClose={() => dismissAlert(alert.id)}
          severity={alert.severity}
          style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000 }}
          className={
            alert?.visible ? "animate-slide-in-top" : "animate-slide-out-top"
          }
        >
          <Paragraph>{alert.description}</Paragraph>
        </Alert>
      ))}
      {children}
    </AlertContext.Provider>
  )
}
