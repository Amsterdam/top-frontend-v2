import { Grid } from "@amsterdam/design-system-react"
import { TextInputControl } from "@amsterdam/ee-ads-rhf"
import type { Path } from "react-hook-form"

type NumberField = {
  name: Path<GebruikersinvoerFormValues>
  label: string
  /** Use 0.01 for decimal (m²/meter) fields, defaults to 1 for whole-number counts. */
  step?: number
}

type Props = {
  fields: NumberField[]
}

/**
 * Renders a responsive grid of numeric TextInputControls, one per field. Most Puntenteller
 * invoervelden are near-identical numeric counts, so this avoids ~60 repeated JSX blocks
 * across the wizard steps.
 */
export function NumberFieldGrid({ fields }: Props) {
  return (
    <Grid
      gapVertical="large"
      style={{ paddingInlineStart: 0 }}
      className="align-items-end"
    >
      {fields.map(({ name, label, step = 1 }) => (
        <Grid.Cell
          key={name}
          span={{ narrow: 4, medium: 4, wide: 3 }}
          appearance="transparent"
        >
          <TextInputControl<GebruikersinvoerFormValues>
            label={label}
            name={name}
            attributes={{ type: "number", min: 0, step }}
            registerOptions={{ valueAsNumber: true, min: 0 }}
          />
        </Grid.Cell>
      ))}
    </Grid>
  )
}
