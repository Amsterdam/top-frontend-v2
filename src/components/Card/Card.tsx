import { type CSSProperties, type ReactNode } from "react"
import {
  Column,
  ErrorMessage,
  Heading,
  Icon,
  Row,
  type IconProps,
} from "@amsterdam/design-system-react"
import styles from "./Card.module.css"

type Props = {
  title: string | ReactNode
  children: ReactNode
  actions?: ReactNode
  className?: string
  icon?: IconProps["svg"]
  loading?: boolean
  loadingBody?: ReactNode
  loadingLabel?: string
  error?: string
}

export function Card({
  title,
  children,
  actions,
  className,
  icon,
  loading = false,
  loadingBody,
  loadingLabel,
  error,
}: Props) {
  const titleContent =
    typeof title === "string" ? <Heading level={3}>{title}</Heading> : title
  const accessibleLoadingLabel =
    loadingLabel ?? (typeof title === "string" ? title : "Kaart")
  const content = loading ? (loadingBody ?? children) : children
  const body = (
    <>
      {loading && (
        <p className="ams-visually-hidden" role="status">
          {accessibleLoadingLabel} wordt geladen.
        </p>
      )}
      {error ? <ErrorMessage>{error}</ErrorMessage> : content}
    </>
  )

  return (
    <Column as="article" className={`${className ?? ""}`}>
      <Row align="between" gap="small" wrap>
        <div className={styles.titleContent}>
          {icon && <Icon svg={icon} size="heading-3" />}
          {titleContent}
        </div>
        {actions}
      </Row>
      <div aria-busy={loading}>{body}</div>
    </Column>
  )
}
