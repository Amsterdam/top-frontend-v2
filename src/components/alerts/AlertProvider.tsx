import { useCallback, useState } from "react"
import { Alert, Paragraph } from "@amsterdam/design-system-react"
import { AlertContext } from "./AlertContext"
import type { AlertMessage } from "./types"

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [alerts, setAlerts] = useState<AlertMessage[]>([])

  const showAlert = useCallback((alert: Omit<AlertMessage, "id">) => {
    setAlerts((current) => [...current, { ...alert, id: crypto.randomUUID() }])
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
