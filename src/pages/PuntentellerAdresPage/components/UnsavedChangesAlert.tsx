import { Alert, Grid, Link, Paragraph } from "@amsterdam/design-system-react"
import { useHasUnsavedChanges } from "../helpers/useHasUnsavedChanges"
import { RESUBMIT_LABEL } from "./StepActions"

type Props = {
  /** The payload of the last successful save as JSON; undefined while nothing is saved yet. */
  savedPayload?: string
  onGoToOverzicht: () => void
}

/**
 * Warns on the resultaat-stap that the form has changed since the last save (see
 * useHasUnsavedChanges), so the punten shown aren't based on it. The button it names is the
 * ResubmitButton below the puntentelling.
 */
export function UnsavedChangesAlert({ savedPayload, onGoToOverzicht }: Props) {
  const hasUnsavedChanges = useHasUnsavedChanges(savedPayload)
  if (!hasUnsavedChanges) return null

  return (
    <Grid.Cell span="all" appearance="transparent">
      <Alert
        heading="Dit resultaat is niet actueel"
        headingLevel={2}
        severity="warning"
      >
        <Paragraph>
          Deze punten zijn berekend met de laatst opgeslagen gegevens. Je
          wijzigingen daarna zijn hier nog niet in verwerkt. Kies '
          {RESUBMIT_LABEL}' of controleer ze eerst in het{" "}
          <Link
            href="#"
            onClick={(event) => {
              event.preventDefault()
              onGoToOverzicht()
            }}
          >
            overzicht
          </Link>
          .
        </Paragraph>
      </Alert>
    </Grid.Cell>
  )
}
