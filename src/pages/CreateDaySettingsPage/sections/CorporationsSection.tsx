import { Grid } from "@amsterdam/design-system-react"
import { SelectControl, CheckboxControlGroup } from "@amsterdam/ee-ads-rhf"
import { Card } from "@/components"
import { mapToOptions } from "@/forms/utils/mapToOptions"
import { useCorporations } from "@/api/hooks/address"
import { useMediaQuery, BREAKPOINTS } from "@/hooks"
import type { FormValues } from "../types"

export function CorporationsSection() {
  const [corporations] = useCorporations()
  const isMobile = useMediaQuery(BREAKPOINTS.sm)

  return (
    <Card title="Corporaties" className="mt-3">
      <Grid gapVertical="large">
        <Grid.Cell span={{ narrow: 4, medium: 8, wide: 6 }}>
          <SelectControl<FormValues>
            name="housing_corporation_combiteam"
            label="Wil je deze looplijst samenlopen met een corporatie?"
            options={[
              { label: "Alle opties", value: "" },
              { label: "Ja", value: "true" },
              { label: "Nee", value: "false" },
            ]}
          />
        </Grid.Cell>
        <Grid.Cell span={{ narrow: 4, medium: 8, wide: 6 }}>
          <CheckboxControlGroup<FormValues>
            label="Met welke corporaties wil je dat de looplijsten gegenereerd worden?"
            name="housing_corporations"
            options={mapToOptions("id", "name", corporations)}
            columns={isMobile ? 1 : 2}
          />
        </Grid.Cell>
      </Grid>
    </Card>
  )
}
