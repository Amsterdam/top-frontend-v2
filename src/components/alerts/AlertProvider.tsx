import { useCallback, useState } from "react"
import { Alert, Paragraph } from "@amsterdam/design-system-react"
import { AlertContext } from "./AlertContext"
import type { AlertMessage } from "./types"

const TIME_TOAST_DISMISS = 5000
const TIMEOUT_FADE_OUT = 500

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [alerts, setAlerts] = useState<AlertMessage[]>([])

  const removeAlert = useCallback((id: string) => {
    setAlerts((current) => current.filter((a) => a.id !== id))
  }, [])

  const showAlert = useCallback(
    (alert: Omit<AlertMessage, "id">) => {
      const id = crypto.randomUUID()
      setAlerts((current) => [...current, { ...alert, id, visible: true }])

      // Start fade-out
      setTimeout(() => {
        setAlerts((current) =>
          current.map((a) => (a.id === id ? { ...a, visible: false } : a)),
        )
      }, TIME_TOAST_DISMISS - TIMEOUT_FADE_OUT)

      // Remove completely after fade-out
      setTimeout(() => removeAlert(id), TIME_TOAST_DISMISS)
    },
    [removeAlert],
  )

  const dismissAlert = useCallback(
    (id: string) => {
      setAlerts((current) =>
        current.map((a) => (a.id === id ? { ...a, visible: false } : a)),
      )
      setTimeout(() => removeAlert(id), TIMEOUT_FADE_OUT)
    },
    [removeAlert],
  )

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
            alert.visible ? "animate-slide-in-top" : "animate-slide-out-top"
          }
        >
          <Paragraph>{alert.description}</Paragraph>
        </Alert>
      ))}
      {children}
    </AlertContext.Provider>
  )
}
