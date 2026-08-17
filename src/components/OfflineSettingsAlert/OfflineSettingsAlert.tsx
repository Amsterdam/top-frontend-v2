import { Alert, Paragraph } from "@amsterdam/design-system-react"

type OfflineSettingsAlertProps = {
  className?: string
}

export function OfflineSettingsAlert({ className }: OfflineSettingsAlertProps) {
  return (
    <Alert
      heading="Offline"
      headingLevel={2}
      severity="warning"
      className={className}
    >
      <Paragraph>
        Je bent offline. Instellingen worden niet opgeslagen zolang de app
        offline is.
      </Paragraph>
    </Alert>
  )
}
