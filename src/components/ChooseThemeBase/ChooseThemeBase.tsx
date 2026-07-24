import {
  Column,
  Grid,
  Heading,
  LinkList,
  Paragraph,
} from "@amsterdam/design-system-react"
import { ChevronForwardIcon } from "@amsterdam/design-system-react-icons"
import { useNavigate } from "react-router"
import { useThemes } from "@/api/hooks"
import { Greeting } from "@/components"
import { useCurrentUser } from "@/hooks/useCurrentUser"

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
  onThemeClick,
}: ChooseThemeBaseProps) {
  const { data: themesData } = useThemes()
  const currentUser = useCurrentUser()
  const navigate = useNavigate()
  const themes = themesData?.results || []

  const handleClick = (themeId: number) => {
    const path = onThemeClick?.(themeId) ?? `${themeId}`
    navigate(path)
  }

  return (
    <Grid paddingVertical="large">
      <Grid.Cell span="all">
        <Column gap="small">
          <Heading level={1}>{title}</Heading>
          <Heading level={2}>Selecteer een team</Heading>
          {currentUser?.first_name && (
            <>
              <Paragraph>
                <Greeting /> <strong>{currentUser.first_name}!</strong>
              </Paragraph>
              {description && (
                <Paragraph className="ams-mb-m">{description}</Paragraph>
              )}
            </>
          )}
          <LinkList>
            {themes.map((theme) => (
              <LinkList.Link
                href="#"
                key={theme.id}
                icon={ChevronForwardIcon}
                onClick={(e) => {
                  e.preventDefault()
                  handleClick(theme.id)
                }}
              >
                {theme.name}
              </LinkList.Link>
            ))}
          </LinkList>
        </Column>
      </Grid.Cell>
    </Grid>
  )
}
