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
}

export function Card({
  title,
  children,
  collapsible = false,
  defaultOpen = true,
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
    <div className={styles.Card}>
      {hasTitle && (
        <>
          <div className={styles.CardTitle}>
            {collapsible ? (
              <button
                type="button"
                className={styles.CardTitleButton}
                onClick={toggle}
                aria-expanded={isOpen}
              >
                <span className={styles.TitleContent}>{renderTitle}</span>

                <span
                  className={`${styles.Chevron} ${isOpen ? styles.ChevronOpen : ""}`}
                  aria-hidden="true"
                >
                  <Icon svg={ChevronDownIcon} size="heading-3" />
                </span>
              </button>
            ) : (
              renderTitle
            )}
          </div>
        </>
      )}
      <div
        className={`${styles.CollapsibleContent} ${isOpen ? styles.CollapsibleOpen : ""}`}
      >
        <div className={`${styles.CollapsibleInner} `}>
          {hasTitle && <Divider margin="medium" />}
          <div className={styles.CardContent}>{children}</div>
        </div>
      </div>
    </div>
  )
}
