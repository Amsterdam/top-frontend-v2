export type Severity = "error" | "success" | "warning"

export type ToastMessage = {
  id: string
  title: string
  description?: string
  severity?: Severity
  visible?: boolean
  /** Shows an action button; also implies persistent (no auto-dismiss). */
  action?: { label: string; onClick: () => void }
  /** Don't auto-dismiss; the user must close it (or use the action). */
  persistent?: boolean
}
