import {
  Button,
  Column,
  Grid,
  Heading,
  Paragraph,
  type GridColumnNumbers,
} from "@amsterdam/design-system-react"
import type { Ref } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { SaveIcon } from "@amsterdam/design-system-react-icons"
import { MissingFieldsAlert } from "../components/MissingFieldsAlert"
import { SUBMIT_LABEL } from "../components/StepActions"
import type { MissingField } from "../helpers/findMissingFields"
import {
  BerekeningCard,
  HuurprijsCard,
  PuntenopbouwCard,
  ScoreCard,
} from "./ResultaatCards"

// Each column takes the full width up to wide; only then do they sit side by side.
const COLUMN_SPAN: GridColumnNumbers = { narrow: 4, medium: 8, wide: 6 }

type Props = {
  resultaat?: PuntentellerResultaat
  isSubmitting?: boolean
  invoerwaarden?: PuntentellerInvoerwaarden
  /** Opens the step of a missing field and focuses it. */
  onGoToField: (field: MissingField) => void
  /** Lets the page focus the MissingFieldsAlert when saving is blocked by missing fields. */
  invalidFormAlertRef?: Ref<HTMLDivElement>
}

/**
 * The resultaat-stap: the puntentotaal with its huursegment, the maximale huurprijs and the
 * subtotal per rubriek on one side, how it was calculated on the other. Above them the
 * required fields still missing, on any step.
 */
export function StepResultaat({
  resultaat,
  isSubmitting,
  invoerwaarden,
  onGoToField,
  invalidFormAlertRef,
}: Props) {
  const { control } = useFormContext<GebruikersinvoerFormValues>()
  const huidigeHuurprijs = useWatch({ control, name: "huidige_huurprijs" })

  return (
    <>
      <MissingFieldsAlert
        ref={invalidFormAlertRef}
        invoerwaarden={invoerwaarden}
        onGoToField={onGoToField}
      />

      {resultaat ? (
        <>
          <Grid.Cell span={COLUMN_SPAN} appearance="transparent">
            <Column gap="large">
              {/* ams-grid__cell: the white block a Grid.Cell is, here inside one, so the
                  cards stack with space between them. */}
              <div className="ams-grid__cell">
                <ScoreCard resultaat={resultaat} />
              </div>
              <div className="ams-grid__cell">
                <HuurprijsCard
                  resultaat={resultaat}
                  huidigeHuurprijs={huidigeHuurprijs}
                />
              </div>
              <div className="ams-grid__cell">
                <PuntenopbouwCard resultaat={resultaat} />
              </div>
            </Column>
          </Grid.Cell>
          <Grid.Cell span={COLUMN_SPAN} appearance="transparent">
            <BerekeningCard resultaat={resultaat} />
          </Grid.Cell>
        </>
      ) : (
        <Grid.Cell span="all">
          <Heading level={2} className="ams-mb-m">
            Nog geen berekening
          </Heading>
          <Paragraph className="ams-mb-m">
            De punten zijn nog niet berekend. Vul de gegevens in en kies '
            {SUBMIT_LABEL}'.
          </Paragraph>
          <Button
            type="submit"
            icon={SaveIcon}
            iconBefore
            disabled={isSubmitting}
          >
            {SUBMIT_LABEL}
          </Button>
        </Grid.Cell>
      )}
    </>
  )
}
