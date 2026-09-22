import { Grid } from "@amsterdam/design-system-react"
import { SelectControl } from "@amsterdam/ee-ads-rhf"
import type { Path } from "react-hook-form"
import { countOptions, type SelectField } from "../fieldDefinitions"

type Props = {
  fields: readonly SelectField[]
}

function SelectFieldCell({
  name,
  label,
  required,
  inFieldSet,
  ...field
}: SelectField) {
  const options = "options" in field ? field.options : countOptions(field.max)

  return (
    <Grid.Cell
      span={{ narrow: 4, medium: 4, wide: 3 }}
      appearance="transparent"
    >
      <SelectControl<GebruikersinvoerFormValues>
        label={label}
        name={name as Path<GebruikersinvoerFormValues>}
        options={options}
        registerOptions={required ? { required } : undefined}
        style={{ width: "100%" }}
        inFieldSet={inFieldSet}
      />
    </Grid.Cell>
  )
}

/**
 * Renders a responsive grid of SelectControls, one per field. Most Puntenteller "count" fields
 * (aantal wastafels, aantal ovens, ...) are a select from "0" to a small max (5 by default),
 * defaulting to "0"; fields with their own fixed, non-numeric options (e.g. a size bucket) pass
 * `options` instead. See fieldDefinitions.ts.
 */
export function SelectFieldGrid({ fields }: Props) {
  return (
    <Grid gapVertical="large" className="align-items-end padding-Inline-start">
      {fields.map((field) => (
        <SelectFieldCell key={field.name} {...field} />
      ))}
    </Grid>
  )
}
