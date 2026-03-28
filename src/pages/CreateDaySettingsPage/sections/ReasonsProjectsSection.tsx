import { Grid } from "@amsterdam/design-system-react"
import { FolderIcon } from "@amsterdam/design-system-react-icons"
import { CheckboxControlGroup } from "@amsterdam/ee-ads-rhf"

import { Card, HeadingWithIcon } from "@/components"
import { mapToOptions } from "@/forms/utils/mapToOptions"
import {
  useTeamSettingsCaseProjects,
  useTeamSettingsReasons,
} from "@/api/hooks"
import type { FormValues } from "../types"

type Props = {
  themeId: string
}

export function ReasonsProjectsSection({ themeId }: Props) {
  const [reasons] = useTeamSettingsReasons(themeId!)
  const [caseProjects] = useTeamSettingsCaseProjects(themeId!)
  return (
    <Card
      title={
        <HeadingWithIcon
          label="Openingsredenen & Projecten"
          highlightIcon
          svg={FolderIcon}
        />
      }
      className="mt-3"
    >
      <Grid gapVertical="large">
        <Grid.Cell span={{ narrow: 4, medium: 8, wide: 6 }}>
          <CheckboxControlGroup<FormValues>
            label="Met welke openingsredenen wil je dat de looplijsten gegenereerd worden?"
            name="reasons"
            options={mapToOptions("id", "name", reasons)}
            registerOptions={{
              required: "Minimaal één openingsreden is verplicht",
            }}
          />
        </Grid.Cell>
        <Grid.Cell span={{ narrow: 4, medium: 8, wide: 6 }}>
          <CheckboxControlGroup<FormValues>
            label="Met welke projecten wil je dat de looplijsten gegenereerd worden?"
            name="project_ids"
            options={mapToOptions("id", "name", caseProjects)}
          />
        </Grid.Cell>
      </Grid>
    </Card>
  )
}
