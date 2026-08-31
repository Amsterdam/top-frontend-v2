import { Grid } from "@amsterdam/design-system-react"
import { TextInputControl } from "@amsterdam/ee-ads-rhf"
import { useFormContext, useWatch, type Path } from "react-hook-form"

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
 * One numeric cell. Some fields (e.g. the *_oppervlakte totals) default to `null` to mean
 * "not filled in yet", but an empty `<input type="number">` must not receive `null`/`NaN` as
 * its `value`, so we coerce those to an empty string here.
 */
function NumberFieldCell({ name, label, step = 1 }: NumberField) {
  const { control } = useFormContext<GebruikersinvoerFormValues>()
  const value = useWatch({ control, name })
  const inputValue =
    value == null || (typeof value === "number" && Number.isNaN(value))
      ? ""
      : (value as number | string)

  return (
    <Grid.Cell
      span={{ narrow: 4, medium: 4, wide: 3 }}
      appearance="transparent"
    >
      <TextInputControl<GebruikersinvoerFormValues>
        label={label}
        name={name}
        attributes={{ type: "number", min: 0, step, value: inputValue }}
        registerOptions={{ valueAsNumber: true, min: 0 }}
      />
    </Grid.Cell>
  )
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
      {fields.map((field) => (
        <NumberFieldCell key={field.name} {...field} />
      ))}
    </Grid>
  )
}
