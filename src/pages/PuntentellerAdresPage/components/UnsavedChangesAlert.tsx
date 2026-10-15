import { Alert, Button, Grid, Paragraph } from "@amsterdam/design-system-react"
import { SaveIcon } from "@amsterdam/design-system-react-icons"
import { useHasUnsavedChanges } from "../helpers/useHasUnsavedChanges"
import { useMissingFields } from "../helpers/useMissingFields"
import { RESUBMIT_LABEL } from "./StepActions"

type Props = {
  /** The payload of the last successful save as JSON; undefined while nothing is saved yet. */
  savedPayload?: string
  isSubmitting?: boolean
  invoerwaarden?: PuntentellerInvoerwaarden
}

/**
 * Warns on the resultaat-stap that the form has changed since the last save (see
 * useHasUnsavedChanges), so the punten shown aren't based on it, with the button to save and
 * calculate again right below. Nothing while required fields are missing: the
 * MissingFieldsAlert says what to do first, and saving again would be blocked anyway.
 */
export function UnsavedChangesAlert({
  savedPayload,
  isSubmitting = false,
  invoerwaarden,
}: Props) {
  const hasUnsavedChanges = useHasUnsavedChanges(savedPayload)
  const missingFields = useMissingFields(invoerwaarden)
  if (!hasUnsavedChanges || missingFields.length > 0) return null

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
