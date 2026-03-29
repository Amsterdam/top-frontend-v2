import { Grid } from "@amsterdam/design-system-react"
import { CheckboxControlGroup } from "@amsterdam/ee-ads-rhf"

import { Card, HeadingWithIcon } from "@/components"
import { mapToOptions } from "@/forms/utils/mapToOptions"
import { useTeamSettingsSubjects, useTeamSettingsTags } from "@/api/hooks"
import type { FormValues } from "../types"
import { TagIcon } from "@/icons/TagIcon"

type Props = {
  themeId?: string
}

export function SubjectsTagsSection({ themeId }: Props) {
  const [subjects] = useTeamSettingsSubjects(themeId!)
  const [tags] = useTeamSettingsTags(themeId!)
  return (
    <Card
      title={
        <HeadingWithIcon
          label="Onderwerpen & Tags"
          highlightIcon
          iconComponent={<TagIcon />}
        />
      }
      className="mt-3"
    >
      {/* <TagIcon /> */}
      <Grid gapVertical="large">
        <Grid.Cell span={{ narrow: 4, medium: 8, wide: 6 }}>
          <CheckboxControlGroup<FormValues>
            label="Met welke onderwerpen wil je dat de looplijsten gegenereerd worden?"
            name="subjects"
            options={mapToOptions("id", "name", subjects)}
          />
        </Grid.Cell>
        <Grid.Cell span={{ narrow: 4, medium: 8, wide: 6 }}>
          <CheckboxControlGroup<FormValues>
            label="Met welke tags wil je dat de looplijsten gegenereerd worden?"
            name="tags"
            options={mapToOptions("id", "name", tags)}
          />
        </Grid.Cell>
      </Grid>
    </Card>
  )
}
