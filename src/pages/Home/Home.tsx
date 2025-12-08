import {
  Button,
  Column,
  Heading,
  PageHeader,
  Paragraph,
} from "@amsterdam/design-system-react"
import { env } from "@/config/env"
import { useThemes } from "@/api/hooks"
import { Greeting } from "@/components"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { ChevronForwardIcon } from "@amsterdam/design-system-react-icons"

export default function Home() {
  const { data: themesData } = useThemes()
  const currentUser = useCurrentUser()
  const themes = themesData?.results || []

  return (
    <>
      <PageHeader brandName={`Toezicht op pad ${env.VITE_ENVIRONMENT_SHORT}`} />
      <Heading level={1}>Genereer looplijst</Heading>
      <Heading level={2}>Kies een team</Heading>
      <Paragraph style={{ margin: "16px 0" }}>
        <Greeting /> <strong>{currentUser?.first_name}</strong>, welke zaken wil
        je vandaag in je looplijst?
      </Paragraph>
      <Column gap="large" alignHorizontal="start">
        {themes?.map((theme) => (
          <Button key={theme.id} variant="secondary" icon={ChevronForwardIcon}>
            {theme.name}
          </Button>
        ))}
      </Column>
    </>
  )
}
