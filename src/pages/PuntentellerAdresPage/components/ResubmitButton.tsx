import { Button } from "@amsterdam/design-system-react"
import { SaveIcon } from "@amsterdam/design-system-react-icons"
import { useHasUnsavedChanges } from "../helpers/useHasUnsavedChanges"
import { RESUBMIT_LABEL } from "./StepActions"

type Props = {
  /** The payload of the last successful save as JSON; undefined while nothing is saved yet. */
  savedPayload?: string
  isSubmitting?: boolean
}

/**
 * Submits the form from the resultaat-stap while it has changed since the last save (see
 * useHasUnsavedChanges), so saving doesn't take a detour via the overzicht-stap.
 */
export function ResubmitButton({ savedPayload, isSubmitting = false }: Props) {
  const hasUnsavedChanges = useHasUnsavedChanges(savedPayload)
  if (!hasUnsavedChanges) return null

  // The div keeps the button at its own width in a Column, which stretches its children.
  return (
    <div>
      <Button type="submit" icon={SaveIcon} iconBefore disabled={isSubmitting}>
        {RESUBMIT_LABEL}
      </Button>
    </div>
  )
}
