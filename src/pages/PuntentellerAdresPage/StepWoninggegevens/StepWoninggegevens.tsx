import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { Grid, Heading } from "@amsterdam/design-system-react"
import {
  RadioControl,
  SelectControl,
  TextInputControl,
} from "@amsterdam/ee-ads-rhf"
import { StepActions } from "../components/StepActions"
import {
  peildatumToJaar,
  sortWozWaardenByPeildatum,
} from "../helpers/mapInvoerwaardenToFormValues"

const ENERGIELABEL_OPTIONS = [
  "A++++",
  "A+++",
  "A++",
  "A+",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
].map((label) => ({ label: `Label ${label}`, value: label }))

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
    <Grid gapVertical="large" className="align-items-end padding-Inline-start">
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
              required: "WOZ-peildatum is verplicht",
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
            required: "WOZ-waarde is verplicht",
            min: 0,
          }}
          inFieldSet
        />
      </Grid.Cell>

      <Grid.Cell span="all" appearance="transparent">
        <Heading level={3}>Energielabel gegevens</Heading>
      </Grid.Cell>
      <Grid.Cell
        span={{ narrow: 4, medium: 4, wide: 4 }}
        appearance="transparent"
      >
        <SelectControl<GebruikersinvoerFormValues>
          label="Energielabel"
          name="energielabel_klasse"
          options={ENERGIELABEL_OPTIONS}
          registerOptions={{ required: "Energielabel is verplicht" }}
          style={{ width: "100%" }}
          inFieldSet
        />
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
            required: "Type woning is verplicht",
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
            required: "Gemeenschappelijke binnenruimtes is verplicht",
          }}
        />
      </Grid.Cell>

      <Grid.Cell span="all" appearance="transparent">
        <StepActions onNextStep={onNextStep} />
      </Grid.Cell>
    </Grid>
  )
}

export default StepWoninggegevens
