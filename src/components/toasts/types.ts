import type { ReactNode } from "react"

export type Severity = "error" | "success" | "warning"

export type ToastMessage = {
  id: string
  title: string
  /** Plain text, or JSX for inline markup (e.g. <strong>). */
  description?: ReactNode
  severity?: Severity
  visible?: boolean
  /** Shows an action button; also implies persistent (no auto-dismiss). */
  action?: { label: string; onClick: () => void }
  /** Don't auto-dismiss; the user must close it (or use the action). */
  persistent?: boolean
}
