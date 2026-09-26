import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { Grid, Heading } from "@amsterdam/design-system-react"
import {
  RadioControl,
  SelectControl,
  TextInputControl,
} from "@amsterdam/ee-ads-rhf"
import { StepActions } from "../components/StepActions"
import { StepInvalidFormAlert } from "../components/StepInvalidFormAlert"
import { REQUIRED_MESSAGES } from "../fieldDefinitions"
import {
  peildatumToJaar,
  sortWozWaardenByPeildatum,
} from "../helpers/mapInvoerwaardenToFormValues"
import { EnergielabelSummary } from "./EnergielabelSummary"

const ENERGIELABEL_OPTIONS = [
  { label: "Maak een keuze", value: "" },
  ...["A++++", "A+++", "A++", "A+", "A", "B", "C", "D", "E", "F", "G"].map(
    (label) => ({ label: `Label ${label}`, value: label }),
  ),
]

const ENERGIE_TYPE_OPTIONS: { label: string; value: EnergieType }[] = [
  { label: "Energielabel", value: "label" },
  { label: "Energie-index", value: "index" },
  { label: "Bouwjaar", value: "bouwjaar" },
]

/** The fields of this step in page order, for the StepInvalidFormAlert. */
const FIELD_NAMES = [
  "woz_peildatum_jaar",
  "woz_waarde",
  "energie_type",
  "energielabel_klasse",
  "energie_index",
  "bouwjaar",
  "type_woning",
  "gemeenschappelijke_binnenruimtes",
] as const

const formatEuro = (value: number) =>
  new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value)

const formatPeildatum = (peildatum: string) =>
  new Intl.DateTimeFormat("nl-NL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(peildatum))

type Props = {
  invoerwaarden?: PuntentellerInvoerwaarden
  onNextStep: () => void
}

export function StepWoninggegevens({ invoerwaarden, onNextStep }: Props) {
  const { control, setValue } = useFormContext<GebruikersinvoerFormValues>()
  const wozWaarden = invoerwaarden
    ? sortWozWaardenByPeildatum(invoerwaarden.woz_waarden)
    : []

  const wozPeildatumOptions = wozWaarden.map((w) => ({
    label: `${formatPeildatum(w.peildatum)} — ${formatEuro(w.vastgestelde_waarde)}`,
    value: String(peildatumToJaar(w.peildatum)),
  }))

  const energieType = useWatch({ control, name: "energie_type" })

  // When the user picks a different peildatum, the WOZ-waarde follows automatically
  // (but remains separately editable afterwards via the WOZ-waarde field below).
  const wozPeildatumJaar = useWatch({ control, name: "woz_peildatum_jaar" })
  useEffect(() => {
    const gekozenWozWaarde = wozWaarden.find(
      (w) => peildatumToJaar(w.peildatum) === Number(wozPeildatumJaar),
    )
    if (!gekozenWozWaarde) return

    setValue("woz_waarde", gekozenWozWaarde.vastgestelde_waarde, {
      shouldValidate: true,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wozPeildatumJaar])

  return (
    <>
      <StepInvalidFormAlert fieldNames={FIELD_NAMES} />

      <Grid.Cell span="all">
        <Grid gapVertical="large" className="align-items-end grid-in-cell">
          <Grid.Cell span="all" appearance="transparent">
            <Heading level={2}>Over de woning</Heading>
          </Grid.Cell>

          <Grid.Cell span="all" appearance="transparent">
            <Heading level={3}>WOZ-waarde gegevens</Heading>
          </Grid.Cell>
          {wozPeildatumOptions.length > 0 && (
            <Grid.Cell
              span={{ narrow: 4, medium: 4, wide: 4 }}
              appearance="transparent"
            >
              <SelectControl<GebruikersinvoerFormValues>
                label="WOZ-peildatum"
                name="woz_peildatum_jaar"
                options={wozPeildatumOptions}
                registerOptions={{
                  required: REQUIRED_MESSAGES.woz_peildatum_jaar,
                }}
                style={{ width: "100%" }}
                inFieldSet
              />
            </Grid.Cell>
          )}
          <Grid.Cell
            span={{ narrow: 4, medium: 4, wide: 4 }}
            appearance="transparent"
          >
            <TextInputControl<GebruikersinvoerFormValues>
              label="WOZ-waarde (€)"
              name="woz_waarde"
              attributes={{ type: "number", min: 0, step: 1 }}
              registerOptions={{
                valueAsNumber: true,
                required: REQUIRED_MESSAGES.woz_waarde,
                min: 0,
              }}
              inFieldSet
            />
          </Grid.Cell>

          <Grid.Cell span="all" appearance="transparent">
            <Heading level={3}>Energielabel gegevens</Heading>
            <EnergielabelSummary energie={invoerwaarden?.energie} />
          </Grid.Cell>
          <Grid.Cell span="all" appearance="transparent">
            <RadioControl<GebruikersinvoerFormValues>
              label="Kies het type energielabel of bouwjaar"
              name="energie_type"
              options={ENERGIE_TYPE_OPTIONS}
              registerOptions={{
                required: REQUIRED_MESSAGES.energie_type,
              }}
              inFieldSet
            />
          </Grid.Cell>
          {/* Only the field for the chosen energie_type is shown (and validated). */}
          <Grid.Cell
            span={{ narrow: 4, medium: 4, wide: 4 }}
            appearance="transparent"
          >
            {energieType === "label" && (
              <SelectControl<GebruikersinvoerFormValues>
                label="Energielabel"
                name="energielabel_klasse"
                options={ENERGIELABEL_OPTIONS}
                registerOptions={{
                  required: REQUIRED_MESSAGES.energielabel_klasse,
                }}
                style={{ width: "100%" }}
                inFieldSet
              />
            )}
            {energieType === "index" && (
              <TextInputControl<GebruikersinvoerFormValues>
                label="Energie-index"
                name="energie_index"
                attributes={{ type: "number", min: 0, step: 0.01 }}
                registerOptions={{
                  valueAsNumber: true,
                  required: REQUIRED_MESSAGES.energie_index,
                  min: 0,
                }}
                inFieldSet
              />
            )}
            {energieType === "bouwjaar" && (
              <TextInputControl<GebruikersinvoerFormValues>
                label="Bouwjaar"
                name="bouwjaar"
                attributes={{ type: "number", step: 1 }}
                registerOptions={{
                  valueAsNumber: true,
                  required: REQUIRED_MESSAGES.bouwjaar,
                }}
                inFieldSet
              />
            )}
          </Grid.Cell>

          <Grid.Cell span="all" appearance="transparent">
            <RadioControl<GebruikersinvoerFormValues>
              label="Wat voor type woning betreft het?"
              description="Een eengezinswoning heeft een eigen voordeur aan de straat of tuin, zoals een rijtjeshuis, hoekwoning, twee-onder-een-kapwoning of vrijstaand huis. Een meergezinswoning maakt onderdeel uit van een gebouw met meerdere woningen, zoals een appartement, flat, etagewoning, maisonette of portiekwoning."
              name="type_woning"
              options={[
                {
                  label: "Eengezinswoning",
                  value: "Eengezinswoning",
                },
                {
                  label: "Meergezinswoning",
                  value: "Meergezinswoning",
                },
              ]}
              registerOptions={{
                required: REQUIRED_MESSAGES.type_woning,
              }}
            />
          </Grid.Cell>

          <Grid.Cell span="all" appearance="transparent">
            <RadioControl<GebruikersinvoerFormValues>
              label="Heeft de woning toegang tot binnenruimtes die worden gedeeld met andere adressen?"
              description="Binnenruimtes die door minimaal twee adressen worden gedeeld tellen mee in de puntentelling. Voorbeelden zijn een gemeenschappelijke (fietsen)berging of een keuken."
              name="gemeenschappelijke_binnenruimtes"
              options={[
                {
                  label: "Ja",
                  value: "true",
                },
                {
                  label: "Nee",
                  value: "false",
                },
              ]}
              registerOptions={{
                required: REQUIRED_MESSAGES.gemeenschappelijke_binnenruimtes,
              }}
            />
          </Grid.Cell>
        </Grid>
      </Grid.Cell>

      <Grid.Cell span="all" appearance="transparent">
        <StepActions onNextStep={onNextStep} />
      </Grid.Cell>
    </>
  )
}

export default StepWoninggegevens
