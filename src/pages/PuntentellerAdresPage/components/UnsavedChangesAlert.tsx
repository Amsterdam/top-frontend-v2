import { Alert, Button, Grid, Paragraph } from "@amsterdam/design-system-react"
import { SaveIcon } from "@amsterdam/design-system-react-icons"
import { useHasUnsavedChanges } from "../helpers/useHasUnsavedChanges"
import { RESUBMIT_LABEL } from "./StepActions"

type Props = {
  /** The payload of the last successful save as JSON; undefined while nothing is saved yet. */
  savedPayload?: string
  isSubmitting?: boolean
}

/**
 * Warns on the resultaat-stap that the form has changed since the last save (see
 * useHasUnsavedChanges), so the punten shown aren't based on it, with the button to save and
 * calculate again right below.
 */
export function UnsavedChangesAlert({
  savedPayload,
  isSubmitting = false,
}: Props) {
  const hasUnsavedChanges = useHasUnsavedChanges(savedPayload)
  if (!hasUnsavedChanges) return null

  return (
    <Grid.Cell span="all" appearance="transparent">
      <Alert
        heading="Dit resultaat is niet actueel"
        headingLevel={2}
        severity="warning"
      >
        <Paragraph className="ams-mb-m">
          De punten hieronder zijn berekend zonder je laatste wijzigingen.
        </Paragraph>
        {/* The div keeps the button at its own width; the Alert's content stretches its
            children. */}
        <div>
          <Button
            type="submit"
            variant="secondary"
            icon={SaveIcon}
            iconBefore
            disabled={isSubmitting}
          >
            {RESUBMIT_LABEL}
          </Button>
        </div>
      </Alert>
    </Grid.Cell>
  )
}
