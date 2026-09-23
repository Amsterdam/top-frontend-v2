import { SelectControl } from "@amsterdam/ee-ads-rhf"
import { Controller, type Path } from "react-hook-form"
import type {
  CountField,
  FieldDefinition,
  OptionsSelectField,
} from "../fieldDefinitions"
import { QuantityCheckbox, QuantityCheckboxList } from "./QuantityCheckbox"

type Props = {
  fields: readonly FieldDefinition[]
}

const isOptionsSelectField = (
  field: FieldDefinition,
): field is OptionsSelectField => "options" in field

function QuantityCheckboxField({ name, label, max }: CountField) {
  // The form value stays the "0".."max" string the puntenberekening expects; only
  // QuantityCheckbox itself works with a number.
  return (
    <Controller<GebruikersinvoerFormValues>
      name={name as Path<GebruikersinvoerFormValues>}
      render={({ field: { value, onChange } }) => (
        <QuantityCheckbox
          id={name}
          label={label}
          value={Number(value) || 0}
          onChange={(aantal) => onChange(String(aantal))}
          max={max}
        />
      )}
    />
  )
}

/**
 * Renders a section's fields: fields with their own fixed `options` as SelectControls, the
 * count fields (the default) as a single-column QuantityCheckboxList. Selects always come
 * first, so a section mixing both doesn't keep its definition order. See fieldDefinitions.ts.
 */
export function SectionFields({ fields }: Props) {
  const selectFields = fields.filter(isOptionsSelectField)
  const countFields = fields.filter(
    (field): field is CountField => !isOptionsSelectField(field),
  )

  return (
    <>
      {selectFields.map(({ name, label, required, options, inFieldSet }) => (
        <SelectControl<GebruikersinvoerFormValues>
          key={name}
          label={label}
          name={name as Path<GebruikersinvoerFormValues>}
          options={options}
          registerOptions={required ? { required } : undefined}
          inFieldSet={inFieldSet}
        />
      ))}
      {countFields.length > 0 && (
        <QuantityCheckboxList>
          {countFields.map((field) => (
            <QuantityCheckboxField key={field.name} {...field} />
          ))}
        </QuantityCheckboxList>
      )}
    </>
  )
}
