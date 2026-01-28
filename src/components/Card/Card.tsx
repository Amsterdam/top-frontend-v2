import { type ReactNode } from "react"
import { Heading } from "@amsterdam/design-system-react"
import { Divider } from "../Divider/Divider"

import styles from "./Card.module.css"

type Props = {
  title?: string | ReactNode
  children: ReactNode
}

export function Card({ title, children }: Props) {
  const hasTitle = Boolean(title)

  return (
    <div className={styles.Card}>
      {hasTitle && (
        <>
          <div className={styles.CardTitle}>
            {typeof title === "string" ? (
              <Heading level={3}>{title}</Heading>
            ) : (
              title
            )}
          </div>
          <Divider />
        </>
      )}

      <div className={styles.CardContent}>{children}</div>
    </div>
  )
}
