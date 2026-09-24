import {
  ActionGroup,
  Button,
  Column,
  Grid,
  Heading,
  Paragraph,
} from "@amsterdam/design-system-react"
import { ChevronBackwardIcon } from "@amsterdam/design-system-react-icons"
import { Description } from "@/components"

const formatPunten = (punten: number) =>
  new Intl.NumberFormat("nl-NL", { maximumFractionDigits: 2 }).format(punten)

/** "sanitair_extra_voorzieningen" becomes "Sanitair extra voorzieningen". */
const rubriekLabel = (rubriek: string) => {
  const label = rubriek.replaceAll("_", " ")
  return label.charAt(0).toUpperCase() + label.slice(1)
}

type Props = {
  resultaat?: PuntentellerResultaat
  onPreviousStep: () => void
}

/** TODO(puntenteller): first draft of the resultaat-stap, showing the raw rubrieken. */
export function StepResultaat({ resultaat, onPreviousStep }: Props) {
  return (
    <>
      <Grid.Cell span="all">
        <Column gap="large">
          <Heading level={2}>Resultaat</Heading>
          {resultaat ? (
            <>
              <Description
                termsWidth="wide"
                data={[
                  {
                    label: "Totaal punten",
                    value: (
                      <strong>
                        {formatPunten(resultaat.totaal_punten_na_caps)}
                      </strong>
                    ),
                  },
                  {
                    label: "Totaal punten vóór caps",
                    value: formatPunten(resultaat.totaal_punten_bruto),
                  },
                ]}
              />
              <Heading level={3}>Punten per rubriek</Heading>
              <Description
                termsWidth="wide"
                data={Object.entries(resultaat.rubrieken).map(
                  ([rubriek, punten]) => ({
                    label: rubriekLabel(rubriek),
                    value: formatPunten(punten),
                  }),
                )}
              />
            </>
          ) : (
            <Paragraph>
              Er is nog geen berekening gemaakt. Ga naar het overzicht en kies
              &quot;Sla op en bereken&quot;.
            </Paragraph>
          )}
        </Column>
      </Grid.Cell>

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
