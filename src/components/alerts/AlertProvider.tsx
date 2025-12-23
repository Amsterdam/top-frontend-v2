import { useCallback, useState } from "react"
import { Alert, Paragraph } from "@amsterdam/design-system-react"
import { AlertContext } from "./AlertContext"
import type { AlertMessage } from "./types"

const TIME_TOAST_DISMISS = 5000 // 5 seconden

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [alerts, setAlerts] = useState<AlertMessage[]>([])

  const showAlert = useCallback((alert: Omit<AlertMessage, "id">) => {
    const id = crypto.randomUUID()
    setAlerts((current) => [...current, { ...alert, id }])

    setTimeout(() => {
      setAlerts((current) => current.filter((a) => a.id !== id))
    }, TIME_TOAST_DISMISS)
  }, [])

  const dismissAlert = useCallback((id: string) => {
    setAlerts((current) => current.filter((a) => a.id !== id))
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
        >
          <Paragraph>{alert.description}</Paragraph>
        </Alert>
      ))}
      {children}
    </AlertContext.Provider>
  )
}
