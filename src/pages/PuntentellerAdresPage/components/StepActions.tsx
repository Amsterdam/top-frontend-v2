import { ActionGroup, Button } from "@amsterdam/design-system-react"
import {
  ChevronForwardIcon,
  SaveIcon,
} from "@amsterdam/design-system-react-icons"

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
          type="submit"
          icon={SaveIcon}
          iconBefore
          disabled={isSubmitting}
        >
          Opslaan
        </Button>
      ) : (
        <Button type="button" onClick={onNextStep} icon={ChevronForwardIcon}>
          Volgende stap
        </Button>
      )}
    </ActionGroup>
  )
}
