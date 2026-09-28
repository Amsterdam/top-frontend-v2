import { Controller, type Path } from "react-hook-form"
import { Field, Label } from "@amsterdam/design-system-react"
import { NumberStepper } from "./NumberStepper"

const MAX_ADRESSEN = 999

type Props = {
  /** The aantal_adressen of a room, e.g. binnenruimtes.0.aantal_adressen. */
  name: Path<GebruikersinvoerFormValues>
  label: string
}

/**
 * How many addresses use a room, as a NumberStepper from 1 (privé) through 999. It can't hold
 * an invalid value, so it needs no validation; an unset value shows (and is sent) as 1.
 */
export function AantalAdressenField({ name, label }: Props) {
  return (
    <Field>
      <Label htmlFor={name} inFieldSet>
        {label}
      </Label>
      <Controller<GebruikersinvoerFormValues>
        name={name}
        render={({ field: { value, onChange } }) => (
          <NumberStepper
            id={name}
            label="Aantal adressen"
            value={Number(value) || 1}
            onChange={onChange}
            max={MAX_ADRESSEN}
            size={3}
            hasVisibleLabel
          />
        )}
      />
    </Field>
  )
}
