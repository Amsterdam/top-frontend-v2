import { SelectControl } from "@amsterdam/ee-ads-rhf"
import type { Path } from "react-hook-form"
import type {
  CountField,
  FieldDefinition,
  OptionsSelectField,
} from "../fieldDefinitions"
import { QuantityCheckboxList } from "./QuantityCheckbox"
import { QuantityCheckboxField } from "./QuantityCheckboxField"

type Props = {
  fields: readonly FieldDefinition[]
}

const isOptionsSelectField = (
  field: FieldDefinition,
): field is OptionsSelectField => "options" in field

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
            <QuantityCheckboxField
              key={field.name}
              name={field.name as Path<GebruikersinvoerFormValues>}
              label={field.label}
              max={field.max}
            />
          ))}
        </QuantityCheckboxList>
      )}
    </>
  )
}
