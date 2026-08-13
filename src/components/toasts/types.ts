export type Severity = "error" | "success" | "warning"

export type ToastMessage = {
  id: string
  title: string
  description?: string
  severity?: Severity
  visible?: boolean
}
