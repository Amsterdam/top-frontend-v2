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
        className="align-items-end padding-Inline-start"
      >
        <Grid.Cell span="all" appearance="transparent">
          <TextInputControl<FormValues>
            label="Naam van de daginstelling"
            name="name"
            registerOptions={{ required: "Naam is verplicht" }}
            inFieldSet
            size={30}
          />
        </Grid.Cell>

        <Grid.Cell span="all" appearance="transparent">
          <DateControl<FormValues>
            label="Ingepland vanaf"
            description="De looplijst bevat alleen zaken die op of na deze datum zijn ingepland. Laat leeg voor alle zaken."
            name="opening_date"
            inFieldSet
          />
        </Grid.Cell>
      </Grid>
    </Card>
  )
}
