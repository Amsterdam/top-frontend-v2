import {
  ActionGroup,
  Button,
  Column,
  Grid,
  Heading,
  Paragraph,
} from "@amsterdam/design-system-react"
import { ChevronBackwardIcon } from "@amsterdam/design-system-react-icons"
import { ResubmitButton } from "../components/ResubmitButton"
import { SUBMIT_LABEL } from "../components/StepActions"
import { BerekeningCard, ScoreCard } from "./ResultaatCards"

type Props = {
  resultaat?: PuntentellerResultaat
  /** The payload of the last successful save, see useHasUnsavedChanges. */
  savedPayload?: string
  isSubmitting?: boolean
  onPreviousStep: () => void
}

/** The resultaat-stap: the puntentotaal with its huursegment, and how it was calculated. */
export function StepResultaat({
  resultaat,
  savedPayload,
  isSubmitting,
  onPreviousStep,
}: Props) {
  return (
    <>
      {resultaat ? (
        <>
          <Grid.Cell
            span={{ narrow: 4, medium: 4, wide: 6 }}
            appearance="transparent"
          >
            <Column gap="large">
              {/* ams-grid__cell: the white block a Grid.Cell is, here inside one, so the
                  ResubmitButton sits right below the card instead of below the taller
                  berekening. */}
              <div className="ams-grid__cell">
                <ScoreCard resultaat={resultaat} />
              </div>
              <ResubmitButton
                savedPayload={savedPayload}
                isSubmitting={isSubmitting}
              />
            </Column>
          </Grid.Cell>
          <Grid.Cell span={{ narrow: 4, medium: 4, wide: 6 }}>
            <BerekeningCard resultaat={resultaat} />
          </Grid.Cell>
        </>
      ) : (
        <Grid.Cell span="all">
          <Heading level={2} className="ams-mb-m">
            Nog geen berekening
          </Heading>
          <Paragraph>
            De punten zijn nog niet berekend. Vul de gegevens in en kies in het
            overzicht '{SUBMIT_LABEL}'.
          </Paragraph>
        </Grid.Cell>
      )}

      <Grid.Cell span="all" appearance="transparent">
        <ActionGroup>
          <Button
            type="button"
            variant="secondary"
            icon={ChevronBackwardIcon}
            iconBefore
            onClick={onPreviousStep}
          >
            Terug naar overzicht
          </Button>
        </ActionGroup>
      </Grid.Cell>
    </>
  )
}

export default StepResultaat
