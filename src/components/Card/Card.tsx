import { useId, useState, type CSSProperties, type ReactNode } from "react"
import {
  Column,
  Heading,
  Icon,
  Row,
  type IconProps,
} from "@amsterdam/design-system-react"
import { ChevronDownIcon } from "@amsterdam/design-system-react-icons"

import styles from "./Card.module.css"

type Props = {
  title: string | ReactNode
  children: ReactNode
  actions?: ReactNode
  className?: string
  icon?: IconProps["svg"]
  style?: CSSProperties
  collapsible?: boolean
  defaultOpen?: boolean
}

export function Card({
  title,
  children,
  actions,
  className,
  icon,
  style,
  collapsible = false,
  defaultOpen = false,
}: Props) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const collapsibleContentId = useId()

  const titleContent =
    typeof title === "string" ? <Heading level={3}>{title}</Heading> : title

  return (
    <Column className={`${styles.card} ${className ?? ""}`} style={style}>
      <Row align="between" gap="small" wrap>
        <div className={styles.titleContent}>
          {icon && <Icon svg={icon} size="heading-3" />}
          {collapsible ? (
            <button
              type="button"
              className={styles.cardTitleButton}
              onClick={() => setIsOpen((open) => !open)}
              aria-expanded={isOpen}
              aria-controls={collapsibleContentId}
            >
              {titleContent}
              <span
                className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
              >
                <Icon svg={ChevronDownIcon} size="heading-3" />
              </span>
            </button>
          ) : (
            titleContent
          )}
        </div>
        {actions && <Row align="end">{actions}</Row>}
      </Row>
      {collapsible ? (
        <div
          id={collapsibleContentId}
          className={`${styles.collapsibleContent} ${isOpen ? styles.collapsibleOpen : ""}`}
        >
          <div className={styles.collapsibleInner}>
            <div>{children}</div>
          </div>
        </div>
      ) : (
        <div>{children}</div>
      )}
    </Column>
  )
}
