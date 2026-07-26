import {
  Heading,
  Paragraph,
  Grid,
  TabNavigation,
} from "@amsterdam/design-system-react"
import { type MouseEvent } from "react"
import { useParams, useSearchParams } from "react-router"
import { AmsterdamCrossSpinner } from "@/components"
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
  const { data: teamSettings, isPending } = useTeamSettings(themeId!)
  const { data: reasons } = useTeamSettingsReasons(themeId!)
  const { data: scheduleTypes } = useTeamSettingsScheduleTypes(themeId!)
  const { data: stateTypes } = useTeamSettingsStateTypes(themeId!)
  const { data: caseProjects } = useTeamSettingsCaseProjects(themeId!)
  const { data: subjects } = useTeamSettingsSubjects(themeId!)
  const { data: tags } = useTeamSettingsTags(themeId!)
  const { data: housingCorporations } = useCorporations()
  const { data: districts } = useDistricts()

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
  const [searchParams, setSearchParams] = useSearchParams()
  const currentDayOfWeekId = Number(
    searchParams.get("dag") ?? DAY_OF_WEEKS[0].id,
  )
  const currentDayOfWeek = DAY_OF_WEEKS.find(
    (dayOfWeek) => dayOfWeek.id === currentDayOfWeekId,
  )

  const handleDayTabClick = (
    event: MouseEvent<HTMLAnchorElement>,
    id: number,
  ) => {
    event.preventDefault()
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set("dag", String(id))
      return next
    })
  }

  if (isPending) {
    return <AmsterdamCrossSpinner />
  }
  return (
    <Grid paddingVertical="large" gapVertical="large">
      <Grid.Cell span="all" appearance="transparent">
        <Heading level={1}>
          Looplijst instellingen{" "}
          {teamSettings?.name && `(${teamSettings.name})`}
        </Heading>
        <Paragraph>
          Pas hier de instellingen aan die worden gebruikt om automatisch een
          looplijst te genereren.
        </Paragraph>
      </Grid.Cell>

      <Grid.Cell appearance="flush" span={{ narrow: 4, medium: 2, wide: 2 }}>
        <TabNavigation
          accessibleName="Navigatie voor de dagen van de week"
          orientation="vertical"
        >
          <TabNavigation.List>
            {DAY_OF_WEEKS.map(({ id, name }) => {
              const count = daySettings.filter((ds) =>
                ds?.week_days?.includes(id),
              ).length

              return (
                <TabNavigation.Link
                  aria-current={currentDayOfWeekId === id ? "page" : undefined}
                  key={id}
                  onClick={(e) => handleDayTabClick(e, id)}
                >
                  {name} ({count})
                </TabNavigation.Link>
              )
            })}
          </TabNavigation.List>
        </TabNavigation>
      </Grid.Cell>

      {teamSettings && currentDayOfWeek && (
        <Grid.Cell
          span={{ narrow: 4, medium: 6, wide: 10 }}
          appearance="transparent"
        >
          <WeekDaySettings
            key={currentDayOfWeek.id}
            dayOfWeekId={currentDayOfWeek.id}
            dayOfWeekName={currentDayOfWeek.name}
            daySettings={daySettings.filter((ds) =>
              ds?.week_days?.includes(currentDayOfWeek.id),
            )}
            teamSettingsOptions={teamSettingsOptions}
            teamId={themeId!}
          />
        </Grid.Cell>
      )}
    </Grid>
  )
}
