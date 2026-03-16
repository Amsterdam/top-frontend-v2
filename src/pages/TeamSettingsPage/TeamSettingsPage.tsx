import { Paragraph } from "@amsterdam/design-system-react"
import { SettingsIcon } from "@amsterdam/design-system-react-icons"
import { useParams } from "react-router"
import { PageHeading } from "@/components"
import { AnimatedName } from "@/animations"
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
import { DAY_OF_WEEKS } from "@/shared/constants/dayOfWeeks"
import type { TeamSettingsOptions } from "./types"

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
        label={
          <span>
            Looplijst instellingen{" "}
            {teamSettings?.name && (
              <AnimatedName text={`(${teamSettings.name})`} />
            )}
          </span>
        }
        backLinkLabel="Terug"
      />
      <Paragraph>
        Pas hier de instellingen aan die worden gebruikt om automatisch een
        looplijst te genereren.
      </Paragraph>
      {teamSettings &&
        DAY_OF_WEEKS.map((dayOfWeek, index) => (
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
