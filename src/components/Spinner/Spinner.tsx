import { Column, Paragraph } from "@amsterdam/design-system-react"
import styles from "./Spinner.module.css"

export function Spinner({ fullPage = false }: { fullPage?: boolean }) {
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
