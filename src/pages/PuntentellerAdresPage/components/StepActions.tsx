import { useFormContext } from "react-hook-form"
import { ActionGroup, Button } from "@amsterdam/design-system-react"
import {
  ChevronForwardIcon,
  SaveIcon,
} from "@amsterdam/design-system-react-icons"

/** The id of the "Sla op en bereken" button, so the overzicht can link to it. */
export const SUBMIT_BUTTON_ID = "sla-op-en-bereken"

type Props = {
  onNextStep?: () => void
  isLastStep?: boolean
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
          id={SUBMIT_BUTTON_ID}
          type="submit"
          icon={SaveIcon}
          iconBefore
          disabled={isSubmitting}
        >
          Sla op en bereken
        </Button>
      ) : (
        <Button type="button" onClick={goToNextStep} icon={ChevronForwardIcon}>
          Volgende stap
        </Button>
      )}
    </ActionGroup>
  )
}
