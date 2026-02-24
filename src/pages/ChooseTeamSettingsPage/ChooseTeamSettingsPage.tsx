import { ChooseThemeBase } from "@/components"
import { SettingsIcon } from "@amsterdam/design-system-react-icons"

export default function ChooseTeamSettingsPage() {
  return (
    <ChooseThemeBase
      title="Instellingen voor looplijsten"
      description="Voor welk team wil je de looplijstinstellingen beheren?"
      icon={<SettingsIcon />}
      settingsIllustration
    />
  )
}
