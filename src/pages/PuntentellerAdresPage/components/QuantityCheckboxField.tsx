import { Controller, type Path } from "react-hook-form"
import { QuantityCheckbox } from "./QuantityCheckbox"

type Props = {
  /** A top-level count field, or one inside a room list (e.g. buitenruimtes.0.laadpaal). */
  name: Path<GebruikersinvoerFormValues>
  label: string
  max?: number
}

/** A QuantityCheckbox bound to a form field. */
export function QuantityCheckboxField({ name, label, max }: Props) {
  // The form value stays the "0".."max" string the puntenberekening expects; only
  // QuantityCheckbox itself works with a number.
  return (
    <Controller<GebruikersinvoerFormValues>
      name={name}
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
