import { Grid } from "@amsterdam/design-system-react"
import { BedIcon } from "@amsterdam/design-system-react-icons"
import { SelectControl } from "@amsterdam/ee-ads-rhf"

import { Card, HeadingWithIcon } from "@/components"
import type { FormValues } from "../types"

export function BedAndBreakfastSection() {
  return (
    <Card
      title={
        <HeadingWithIcon label="Bed & Breakfast" highlightIcon svg={BedIcon} />
      }
    >
      <Grid gapVertical="large">
        <Grid.Cell
          span={{ narrow: 4, medium: 8, wide: 6 }}
          appearance="transparent"
        >
          <SelectControl<FormValues>
            name="is_bed_and_breakfast"
            label="Wil je deze looplijst filteren op Bed & Breakfast?"
            description="Als je kiest voor 'Alleen B&B-zaken', worden alleen adressen met een geldige PowerBrowser-vergunning opgenomen in de looplijst. Een B&B-vergunning is geldig als het resultaat 'Verleend' is en de startdatum in het verleden ligt."
            options={[
              { label: "Geen voorkeur", value: "" },
              { label: "Alleen B&B-zaken", value: "true" },
              { label: "Geen B&B-zaken", value: "false" },
            ]}
            inFieldSet
          />
        </Grid.Cell>
      </Grid>
    </Card>
  )
}
