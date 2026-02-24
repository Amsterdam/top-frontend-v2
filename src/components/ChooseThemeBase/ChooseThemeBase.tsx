import {
  Button,
  Column,
  Heading,
  Paragraph,
} from "@amsterdam/design-system-react"
import { ChevronForwardIcon } from "@amsterdam/design-system-react-icons"
import { useNavigate } from "react-router"
import { useThemes } from "@/api/hooks"
import { Greeting, PageHeading } from "@/components"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import styles from "./ChooseThemeBase.module.css"

interface ChooseThemeBaseProps {
  title: string
  description?: string
  icon?: React.ReactNode
  settingsIllustration?: boolean
  onThemeClick?: (themeId: number) => void
}

export function ChooseThemeBase({
  title,
  description,
  icon,
  settingsIllustration = false,
  onThemeClick,
}: ChooseThemeBaseProps) {
  const [themesData] = useThemes()
  const currentUser = useCurrentUser()
  const navigate = useNavigate()
  const themes = themesData?.results || []

  const handleClick = (themeId: number) => {
    const path = onThemeClick?.(themeId) ?? `${themeId}`
    navigate(path)
  }

  return (
    <div
      className={
        settingsIllustration
          ? styles.settingsIllustration
          : styles.defaultIllustration
      }
    >
      <PageHeading icon={icon} label={title} />
      <Heading level={2}>Selecteer een team</Heading>
      <div className="animate-tracking-expand mt-3 mb-3">
        {currentUser?.first_name && (
          <>
            <Paragraph>
              <Greeting /> <strong>{currentUser.first_name}!</strong>
            </Paragraph>
            {description && <Paragraph>{description}</Paragraph>}
          </>
        )}
      </div>
      <Column alignHorizontal="start">
        {themes.map((theme, index) => (
          <Button
            key={theme.id}
            variant="secondary"
            icon={ChevronForwardIcon}
            className="animate-fade-slide-in-bottom"
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => handleClick(theme.id)}
          >
            {theme.name}
          </Button>
        ))}
      </Column>
    </div>
  )
}
