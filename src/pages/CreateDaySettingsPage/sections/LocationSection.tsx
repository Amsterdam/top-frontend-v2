import { Grid } from "@amsterdam/design-system-react"
import { CheckboxControlGroup, RadioControl } from "@amsterdam/ee-ads-rhf"
import { useWatch } from "react-hook-form"

import { Card } from "@/components"
import { PostalCodeRanges } from "../form/PostalCodeRanges"
import { useMediaQuery, BREAKPOINTS } from "@/hooks"
import { mapToOptions } from "@/forms/utils/mapToOptions"
import { useDistricts } from "@/api/hooks/"
import type { FormValues } from "../types"

export function LocationSection() {
  const [districts] = useDistricts()
  const isMobile = useMediaQuery(BREAKPOINTS.sm)

  const postalCodesType = useWatch({
    name: "postal_codes_type",
  })
  const isPostalCode = postalCodesType === "postcode"

  return (
    <Card title="Locatie & Stadsdelen" className="mt-3">
      <Grid gapVertical="large">
        <Grid.Cell span={{ narrow: 4, medium: 5, wide: 4 }}>
          <RadioControl<FormValues>
            label="Selecteer postcodes of stadsdelen"
            name="postal_codes_type"
            options={[
              { label: "Stadsdelen", value: "stadsdeel" },
              { label: "Postcodes", value: "postcode" },
            ]}
            registerOptions={{
              required: "Dit veld is verplicht!",
            }}
            columns={isMobile ? 1 : 2}
          />
        </Grid.Cell>
        <Grid.Cell span={{ narrow: 4, medium: 8, wide: 9 }}>
          {isPostalCode ? (
            <PostalCodeRanges name="postal_code_ranges" />
          ) : (
            <CheckboxControlGroup<FormValues>
              label="Stadsdelen"
              name="districts"
              options={mapToOptions("id", "name", districts)}
              registerOptions={{
                required: "Stadsdeel is verplicht",
              }}
              columns={isMobile ? 1 : 3}
            />
          )}
        </Grid.Cell>
      </Grid>
    </Card>
  )
}
