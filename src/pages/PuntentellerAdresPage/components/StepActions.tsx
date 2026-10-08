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
  /** The label of the next step button; "Volgende stap" unless the step says where it leads. */
  nextStepLabel?: string
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
  nextStepLabel = "Volgende stap",
  isLastStep = false,
  hasUnsavedChanges = false,
  isSubmitting = false,
}: Props) {
  const { trigger } = useFormContext<GebruikersinvoerFormValues>()

  // Only the current step is rendered, so trigger() validates just its fields (including a
  // ruimte that's still open). The tabs still let the user skip a step; the overzicht lists
  // whatever is missing then.
  const goToNextStep = async () => {
    if (await trigger()) {
      onNextStep?.()
    } else {
      focusErrors()
    }
  }

  return (
    <ActionGroup>
      {isLastStep ? (
        <Button
          type="submit"
          icon={SaveIcon}
          iconBefore
          disabled={isSubmitting}
        >
          {hasUnsavedChanges ? RESUBMIT_LABEL : SUBMIT_LABEL}
        </Button>
      ) : (
        <Button type="button" onClick={goToNextStep} icon={ChevronForwardIcon}>
          {nextStepLabel}
        </Button>
      )}
    </ActionGroup>
  )
}
