import {
  Button,
  Column,
  Heading,
  Paragraph,
} from "@amsterdam/design-system-react"
import { ChevronForwardIcon } from "@amsterdam/design-system-react-icons"
import { useThemes } from "@/api/hooks"
import { Greeting } from "@/components"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import styles from "./Looplijst.module.css"

export default function Looplijst() {
  const { data: themesData } = useThemes()
  const currentUser = useCurrentUser()
  const themes = themesData?.results || []

  return (
    <div className={styles.illustration}>
      <Heading level={1}>Genereer looplijst</Heading>
      <Heading level={2}>Kies een team</Heading>
      <Paragraph style={{ margin: "16px 0" }}>
        <Greeting /> <strong>{currentUser?.first_name}</strong>, welke zaken wil
        je vandaag in je looplijst?
      </Paragraph>
      <Column gap="large" alignHorizontal="start">
        {themes?.map((theme, index) => (
          <Button
            key={theme.id}
            variant="secondary"
            icon={ChevronForwardIcon}
            className={styles["fade-slide-in"]}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {theme.name}
          </Button>
        ))}
      </Column>
    </div>
  )
}
