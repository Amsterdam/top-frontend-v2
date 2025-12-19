import { Column, Paragraph } from "@amsterdam/design-system-react"
import styles from "./WritingLoader.module.css"

export function WritingLoader({ fullPage = false }: { fullPage?: boolean }) {
  if (fullPage) {
    return (
      <div className={styles.fullPageContainer}>
        <Column alignHorizontal="center">
          <div className={styles.loader} />
          <Paragraph>Even geduld…</Paragraph>
        </Column>
      </div>
    )
  }
  return <div className={styles.loader} />
}
