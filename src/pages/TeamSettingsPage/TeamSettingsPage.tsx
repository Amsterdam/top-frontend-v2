import { Paragraph } from "@amsterdam/design-system-react"
import { SettingsIcon } from "@amsterdam/design-system-react-icons"
import { useParams } from "react-router"
import { PageHeading } from "@/components"
import { WeekDaySettings } from "./WeekConfig/WeekDaySettings"
import {
  useTeamSettings,
  useTeamSettingsReasons,
  useTeamSettingsScheduleTypes,
  useTeamSettingsStateTypes,
  useTeamSettingsCaseProjects,
  useTeamSettingsSubjects,
  useTeamSettingsTags,
  useCorporations,
  useDistricts,
} from "@/api/hooks"
import type { TeamSettingsOptions } from "./types"

const dayOfWeeks = [
  { id: 0, name: "Maandag" },
  { id: 1, name: "Dinsdag" },
  { id: 2, name: "Woensdag" },
  { id: 3, name: "Donderdag" },
  { id: 4, name: "Vrijdag" },
  { id: 5, name: "Zaterdag" },
  { id: 6, name: "Zondag" },
]

export default function TeamSettingsPage() {
  const { themeId } = useParams<{ themeId: string }>()
  const [teamSettings] = useTeamSettings(themeId!)
  const [reasons] = useTeamSettingsReasons(themeId!)
  const [scheduleTypes] = useTeamSettingsScheduleTypes(themeId!)
  const [stateTypes] = useTeamSettingsStateTypes(themeId!)
  const [caseProjects] = useTeamSettingsCaseProjects(themeId!)
  const [subjects] = useTeamSettingsSubjects(themeId!)
  const [tags] = useTeamSettingsTags(themeId!)
  const [housingCorporations] = useCorporations()
  const [districts] = useDistricts()

  const teamSettingsOptions: TeamSettingsOptions = {
    reasons,
    scheduleTypes,
    stateTypes,
    caseProjects,
    subjects,
    tags,
    housingCorporations,
    districts,
  }

  const daySettings = (teamSettings?.day_settings_list || []) as DaySettings[]

  return (
    <>
      <PageHeading
        icon={SettingsIcon}
        label={`Looplijst instellingen (${teamSettings?.name ?? ""})`}
        backLinkLabel="Terug"
      />
      <Paragraph>
        Pas hier de instellingen aan die worden gebruikt om automatisch een
        looplijst te genereren.
      </Paragraph>
      {teamSettings &&
        dayOfWeeks.map((dayOfWeek, index) => (
          <WeekDaySettings
            key={dayOfWeek.id}
            dayOfWeekId={dayOfWeek.id}
            dayOfWeekName={dayOfWeek.name}
            daySettings={daySettings.filter((ds) =>
              ds?.week_days?.includes(dayOfWeek.id),
            )}
            teamSettingsOptions={teamSettingsOptions}
            animationDelay={index * 0.2}
          />
        ))}
    </>
  )
}
