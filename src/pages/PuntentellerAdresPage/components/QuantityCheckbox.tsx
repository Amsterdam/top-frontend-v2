import type { ReactNode } from "react"
import { Checkbox } from "@amsterdam/design-system-react"
import { NumberStepper } from "./NumberStepper"
import styles from "./QuantityCheckbox.module.css"

type Props = {
  id: string
  label: string
  /** The aantal; 0 means the voorziening isn't present. */
  value: number
  onChange: (value: number) => void
  /** Highest selectable aantal; defaults to 5. */
  max?: number
}

/**
 * A voorziening as one row: a checkbox on the left and, once checked, an aantal stepper
 * (1 through `max`) on the right, or below the checkbox on narrow screens. Checking sets the aantal to 1, unchecking hides the stepper
 * and resets it to 0. The stepper comes directly after the checkbox in the DOM so it's the next
 * Tab stop; focus is deliberately not moved on check. The stepper is labeled "Aantal <label>".
 * Render these inside a QuantityCheckboxList so the steppers line up.
 */
export function QuantityCheckbox({
  id,
  label,
  value,
  onChange,
  max = 5,
}: Props) {
  const checked = value > 0

  return (
    <div className={styles.item}>
      <Checkbox
        id={id}
        className={styles.checkbox}
        checked={checked}
        onChange={(event) => onChange(event.target.checked ? 1 : 0)}
      >
        {label}
      </Checkbox>
      {checked && (
        <div className={styles.stepper}>
          <NumberStepper
            id={`${id}-aantal`}
            label={`Aantal ${label}`}
            value={value}
            onChange={onChange}
            max={max}
          />
        </div>
      )}
    </div>
  )
}

/** Single-column list of QuantityCheckboxs, with every stepper in the same right-hand column. */
export function QuantityCheckboxList({ children }: { children: ReactNode }) {
  return <div className={styles.list}>{children}</div>
}
