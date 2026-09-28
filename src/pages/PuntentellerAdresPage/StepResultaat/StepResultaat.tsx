import { ActionGroup, Button, Grid } from "@amsterdam/design-system-react"
import { ChevronBackwardIcon } from "@amsterdam/design-system-react-icons"
import { BerekeningCard, ScoreCard } from "./ResultaatCards"

type Props = {
  resultaat?: PuntentellerResultaat
  onPreviousStep: () => void
}

/** The resultaat-stap: the puntentotaal with its huursegment, and how it was calculated. */
export function StepResultaat({ resultaat, onPreviousStep }: Props) {
  return (
    <>
      {resultaat && (
        <>
          <Grid.Cell span={{ narrow: 4, medium: 4, wide: 6 }}>
            <ScoreCard resultaat={resultaat} />
          </Grid.Cell>
          <Grid.Cell span={{ narrow: 4, medium: 4, wide: 6 }}>
            <BerekeningCard resultaat={resultaat} />
          </Grid.Cell>
        </>
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
