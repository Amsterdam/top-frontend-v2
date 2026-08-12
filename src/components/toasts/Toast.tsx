import { forwardRef } from "react"
import { Heading, Icon, IconButton, Paragraph, Row } from "@amsterdam/design-system-react"
import {
  ErrorFillIcon,
  InfoFillIcon,
  SuccessFillIcon,
  WarningFillIcon,
} from "@amsterdam/design-system-react-icons"
import type { ToastMessage, Severity } from "./types"
import styles from "./Toast.module.css"

const iconBySeverity: Record<Severity | "info", typeof InfoFillIcon> = {
  error: ErrorFillIcon,
  success: SuccessFillIcon,
  warning: WarningFillIcon,
  info: InfoFillIcon,
}

type Props = {
  toast: ToastMessage
  onDismiss: () => void
  className?: string
}

export const Toast = forwardRef<HTMLDivElement, Props>(function Toast(
  { toast, onDismiss, className },
  ref,
) {
  const severity = toast.severity ?? "info"

  return (
    <div
      ref={ref}
      role="status"
      data-severity={severity}
      className={`${styles.toast} ${className ?? ""}`}
    >
      <Icon svg={iconBySeverity[severity]} size="heading-2" className={styles.icon} />
      <div className={styles.content}>
        <Row align="between" >
          <Heading level={2} className={styles.title}>
            {toast.title}
          </Heading>
          <IconButton
            label="Sluiten"
            size="heading-3"
            onClick={onDismiss}
            className={styles.closeButton}
          />
        </Row>
        {toast.description && (
          <Paragraph className={styles.description}>{toast.description}</Paragraph>
        )}
      </div>
    </div>
  )
})
