import { Grid } from "@amsterdam/design-system-react"
import { CheckboxControlGroup } from "@amsterdam/ee-ads-rhf"
import { Card } from "@/components"
import { mapToOptions } from "@/forms/utils/mapToOptions"
import {
  useTeamSettingsScheduleTypes,
  useTeamSettingsStateTypes,
} from "@/api/hooks"
import type { FormValues } from "../types"

type Props = {
  themeId: string
}

export function PlanningPrioritySection({ themeId }: Props) {
  const [scheduleTypes] = useTeamSettingsScheduleTypes(themeId!)
  const [stateTypes] = useTeamSettingsStateTypes(themeId!)

  return (
    <Card title="Planning & Prioriteit" className="mt-3">
      <Grid gapVertical="large">
        <Grid.Cell span={{ narrow: 4, medium: 4, wide: 12 }}>
          <CheckboxControlGroup<FormValues>
            label="Met welke status wil je dat de looplijsten gegenereerd worden?"
            name="state_types"
            options={mapToOptions("id", "name", stateTypes)}
            registerOptions={{
              required: "Minimaal één status is verplicht",
            }}
          />
        </Grid.Cell>

        <Grid.Cell span={{ narrow: 4, medium: 4, wide: 4 }}>
          <CheckboxControlGroup<FormValues>
            label="Welke dagdelen?"
            name="day_segments"
            options={mapToOptions("id", "name", scheduleTypes?.day_segments)}
            registerOptions={{
              required: "Minimaal één dagdeel is verplicht",
            }}
          />
        </Grid.Cell>

        <Grid.Cell span={{ narrow: 4, medium: 4, wide: 4 }}>
          <CheckboxControlGroup<FormValues>
            label="Welke weekdelen?"
            name="week_segments"
            options={mapToOptions("id", "name", scheduleTypes?.week_segments)}
            registerOptions={{
              required: "Minimaal één weekdeel is verplicht",
            }}
          />
        </Grid.Cell>
        <Grid.Cell span={{ narrow: 4, medium: 4, wide: 4 }}>
          <CheckboxControlGroup<FormValues>
            label="Prioriteiten"
            name="priorities"
            options={mapToOptions("id", "name", scheduleTypes?.priorities)}
            registerOptions={{
              required: "Minimaal één prioriteit is verplicht",
            }}
          />
        </Grid.Cell>
      </Grid>
    </Card>
  )
}
