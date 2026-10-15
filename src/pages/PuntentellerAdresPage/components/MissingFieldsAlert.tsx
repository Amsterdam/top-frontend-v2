import type { MouseEvent, Ref } from "react"
import { Grid, InvalidFormAlert } from "@amsterdam/design-system-react"
import type { MissingField } from "../helpers/findMissingFields"
import { useMissingFields } from "../helpers/useMissingFields"

type Props = {
  invoerwaarden?: PuntentellerInvoerwaarden
  /** Opens the step of a missing field and focuses it; the field isn't rendered here. */
  onGoToField: (field: MissingField) => void
  /** Lets the page focus the alert when saving is blocked by missing fields. */
  ref?: Ref<HTMLDivElement>
}

/**
 * The required fields still missing across all steps, in an InvalidFormAlert on the
 * resultaat-stap. Nothing once everything required is filled in.
 */
export function MissingFieldsAlert({ invoerwaarden, onGoToField, ref }: Props) {
  const missingFields = useMissingFields(invoerwaarden)

  if (missingFields.length === 0) return null

  // The InvalidFormAlert renders plain #links, but the fields sit on other steps and aren't
  // in the page, so a click opens the field's step instead.
  const goToField = (event: MouseEvent<HTMLDivElement>) => {
    const link = (event.target as HTMLElement).closest("a")
    const field = missingFields.find(
      ({ name }) => link?.getAttribute("href") === `#${name}`,
    )
    if (!field) return
    event.preventDefault()
    onGoToField(field)
  }

  return (
    <Grid.Cell span="all" appearance="transparent">
      <InvalidFormAlert
        ref={ref}
        errors={missingFields.map(({ name, message }) => ({
          id: `#${name}`,
          label: message,
        }))}
        focusOnRender={false}
        headingLevel={2}
        onClick={goToField}
      />
    </Grid.Cell>
  )
}
