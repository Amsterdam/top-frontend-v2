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

export function StepActions({
  onNextStep,
  isLastStep = false,
  isSubmitting = false,
}: Props) {
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
        <Button type="button" onClick={onNextStep} icon={ChevronForwardIcon}>
          Volgende stap
        </Button>
      )}
    </ActionGroup>
  )
}
