import { Icon, Paragraph } from "@amsterdam/design-system-react"
import { SpeechBalloonEllipsisIcon } from "@amsterdam/design-system-react-icons"
import styles from "./Note.module.css"

export function Note({ note }: { note?: string | null }) {
  if (!note) return null
  return (
    <div className={styles.noteContainer}>
      <Icon svg={SpeechBalloonEllipsisIcon} size="heading-3" />
      <Paragraph className={styles.noteText}>{note}</Paragraph>
    </div>
  )
}
