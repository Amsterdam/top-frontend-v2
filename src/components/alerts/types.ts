export type Severity = "error" | "success" | "warning"

export type AlertMessage = {
  id: string
  title: string
  description?: string
  severity?: Severity
  visible?: boolean
}
