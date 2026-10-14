import type { MouseEvent } from "react"
import { useFormContext } from "react-hook-form"
import { ActionGroup, Button } from "@amsterdam/design-system-react"
import {
  ChevronForwardIcon,
  SaveIcon,
} from "@amsterdam/design-system-react-icons"

export const SUBMIT_LABEL = "Sla op en bereken"
/** The submit label once the form has changed since the last save. */
export const RESUBMIT_LABEL = "Wijzigingen opslaan en herberekenen"

type Props = {
  onNextStep?: () => void
  isLastStep?: boolean
  /** Whether the form has changed since the last save, which the submit button then says. */
  hasUnsavedChanges?: boolean
  isSubmitting?: boolean
}

/**
 * Focuses the step's InvalidFormAlert, or the first invalid field (aria-invalid) when the step
 * has none. Both only render after trigger() resolves, hence the animation frame.
 */
const focusErrors = () =>
  requestAnimationFrame(() =>
    (
      document.querySelector<HTMLElement>(".ams-invalid-form-alert") ??
      document.querySelector<HTMLElement>('[aria-invalid="true"]')
    )?.focus(),
  )

export function StepActions({
  onNextStep,
  isLastStep = false,
  hasUnsavedChanges = false,
  isSubmitting = false,
}: Props) {
  const { trigger } = useFormContext<GebruikersinvoerFormValues>()

  // Only the current step is rendered, so trigger() validates just its fields (including a
  // ruimte that's still open). The tabs still let the user skip a step; the resultaat lists
  // whatever is missing then.
  const goToNextStep = async () => {
    if (await trigger()) {
      onNextStep?.()
    } else {
      focusErrors()
    }
  }

  // Validates the step first like goToNextStep, so a blocked save focuses the step's
  // InvalidFormAlert too, instead of handleSubmit focusing the first invalid field.
  const submit = async (event: MouseEvent<HTMLButtonElement>) => {
    const { form } = event.currentTarget
    if (await trigger()) {
      form?.requestSubmit()
    } else {
      focusErrors()
    }
  }

  return (
    <ActionGroup>
      {isLastStep ? (
        <Button
          type="button"
          onClick={submit}
          icon={SaveIcon}
          iconBefore
          disabled={isSubmitting}
        >
          {hasUnsavedChanges ? RESUBMIT_LABEL : SUBMIT_LABEL}
        </Button>
      ) : (
        <Button type="button" onClick={goToNextStep} icon={ChevronForwardIcon}>
          Volgende stap
        </Button>
      )}
    </ActionGroup>
  )
}
