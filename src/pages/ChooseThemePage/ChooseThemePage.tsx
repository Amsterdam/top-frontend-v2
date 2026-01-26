import {
  Button,
  Column,
  Heading,
  Paragraph,
} from "@amsterdam/design-system-react"
import { ChevronForwardIcon } from "@amsterdam/design-system-react-icons"
import { useNavigate } from "react-router"
import { useThemes } from "@/api/hooks"
import { Greeting } from "@/components"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import styles from "./ChooseThemePage.module.css"

export default function ChooseThemePage() {
  const [themesData] = useThemes()
  const currentUser = useCurrentUser()
  const navigate = useNavigate()
  const themes = themesData?.results || []

  return (
    <div className={styles.illustration}>
      <Heading level={1}>Genereer looplijst</Heading>
      <Heading level={2}>Kies een team</Heading>
      <Paragraph
        style={{ margin: "16px 0" }}
        className="animate-tracking-expand"
      >
        <Greeting /> <strong>{currentUser?.first_name}</strong>, welke zaken wil
        je vandaag in je looplijst?
      </Paragraph>
      <Column gap="large" alignHorizontal="start">
        {themes?.map((theme, index) => (
          <Button
            key={theme.id}
            variant="secondary"
            icon={ChevronForwardIcon}
            className="animate-fade-slide-in-bottom"
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => navigate(`/lijst/nieuw/${theme.id}`)}
          >
            {theme.name}
          </Button>
        ))}
      </Column>
    </div>
  )
}
