import { useState } from "react"
import { Button, Label, TextInput } from "@amsterdam/design-system-react"
import { MinusIcon, PlusIcon } from "@amsterdam/design-system-react-icons"
import styles from "./NumberStepper.module.css"

type Props = {
  id: string
  /** Accessible label for the input, e.g. "Aantal Eénhandsmengkraan"; the buttons get
   * "<label> verlagen" / "<label> verhogen". */
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

/**
 * A [−] [n] [+] stepper. The input accepts typing too: a number within min..max is taken over
 * immediately, anything else is clamped (out of range) or reset (empty) on blur.
 */
export function NumberStepper({
  id,
  label,
  value,
  onChange,
  min = 1,
  max = 5,
}: Props) {
  // What's being typed, while it isn't (yet) a valid aantal; null shows `value` itself.
  const [draft, setDraft] = useState<string | null>(null)

  const step = (delta: number) => {
    setDraft(null)
    onChange(clamp(value + delta, min, max))
  }

  const handleInputChange = (input: string) => {
    const digits = input.replace(/\D/g, "")
    const parsed = Number(digits)
    if (digits !== "" && parsed >= min && parsed <= max) {
      setDraft(null)
      onChange(parsed)
    } else {
      setDraft(digits)
    }
  }

  const handleBlur = () => {
    if (draft === null) return
    setDraft(null)
    if (draft !== "") onChange(clamp(Number(draft), min, max))
  }

  return (
    <div className={styles.stepper}>
      <Button
        variant="secondary"
        icon={MinusIcon}
        iconOnly
        disabled={value <= min}
        onClick={() => step(-1)}
      >
        {label} verlagen
      </Button>
      <Label htmlFor={id} className="ams-visually-hidden">
        {label}
      </Label>
      <TextInput
        id={id}
        inputMode="numeric"
        // Without `size`, ADS stretches the input to 100% width and overrides our inline-size.
        size={1}
        autoComplete="off"
        className={styles.input}
        value={draft ?? String(value)}
        onChange={(event) => handleInputChange(event.target.value)}
        onBlur={handleBlur}
      />
      <Button
        variant="secondary"
        icon={PlusIcon}
        iconOnly
        disabled={value >= max}
        onClick={() => step(1)}
      >
        {label} verhogen
      </Button>
    </div>
  )
}
