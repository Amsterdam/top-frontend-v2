import { Grid } from "@amsterdam/design-system-react"
import { TextInputControl, DateControl } from "@amsterdam/ee-ads-rhf"
import { Card, HeadingWithIcon } from "@/components"
import type { FormValues } from "../types"
import { SettingsIcon } from "@amsterdam/design-system-react-icons"

export function GeneralSettingsSection() {
  return (
    <Card
      title={
        <HeadingWithIcon
          label="Algemene instellingen"
          highlightIcon
          svg={SettingsIcon}
        />
      }
    >
      <Grid
        gapVertical="large"
        paddingBottom="large"
        style={{ paddingInlineStart: 0 }}
      >
        <Grid.Cell
          span={{ narrow: 4, medium: 4, wide: 6 }}
          appearance="transparent"
        >
          <TextInputControl<FormValues>
            label="Naam van de daginstelling"
            name="name"
            registerOptions={{ required: "Naam is verplicht" }}
          />
        </Grid.Cell>

        <Grid.Cell
          span={{ narrow: 4, medium: 4, wide: 6 }}
          appearance="transparent"
        >
          <DateControl<FormValues>
            label="Begindatum"
            name="opening_date"
            registerOptions={{ required: "Begindatum is verplicht" }}
          />
        </Grid.Cell>
      </Grid>
    </Card>
  )
}
