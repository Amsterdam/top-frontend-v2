import { type ReactNode, useState } from "react"
import { Heading, Icon } from "@amsterdam/design-system-react"
import { Divider } from "../Divider/Divider"
import { ChevronDownIcon } from "@amsterdam/design-system-react-icons"

import styles from "./Card.module.css"

type Props = {
  title?: string | ReactNode
  children: ReactNode
  collapsible?: boolean
  defaultOpen?: boolean
  noContentPadding?: boolean
}

export function Card({
  title,
  children,
  collapsible = false,
  defaultOpen = true,
  noContentPadding = false,
}: Props) {
  const hasTitle = Boolean(title)
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const renderTitle =
    typeof title === "string" ? <Heading level={3}>{title}</Heading> : title

  const toggle = () => {
    if (collapsible) {
      setIsOpen(!isOpen)
    }
  }

  return (
    <div className={styles.card}>
      {hasTitle && (
        <div className={styles.cardTitle}>
          {collapsible ? (
            <button
              type="button"
              className={styles.cardTitleButton}
              onClick={toggle}
              aria-expanded={isOpen}
            >
              <span className={styles.titleContent}>{renderTitle}</span>
              <span
                className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
                aria-hidden="true"
              >
                <Icon svg={ChevronDownIcon} size="heading-3" />
              </span>
            </button>
          ) : (
            renderTitle
          )}
        </div>
      )}
      <div
        className={`${styles.collapsibleContent} ${isOpen ? styles.collapsibleOpen : ""}`}
      >
        <div className={styles.collapsibleInner}>
          {hasTitle && (
            <Divider margin="medium" noMarginBottom={noContentPadding} />
          )}
          <div
            className={`${styles.cardContent} ${noContentPadding ? styles.noContentPadding : ""}`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
