import { Icon, Paragraph } from "@amsterdam/design-system-react"
import { SpeechBalloonEllipsisIcon } from "@amsterdam/design-system-react-icons"

export function Note({ note }: { note?: string | null }) {
  if (!note) return null
  return (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <Icon svg={SpeechBalloonEllipsisIcon} size="heading-3" />
      <Paragraph>{note}</Paragraph>
    </div>
  )
}
