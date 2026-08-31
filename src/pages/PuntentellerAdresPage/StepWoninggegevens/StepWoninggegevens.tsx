import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { Grid } from "@amsterdam/design-system-react"
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
].map((label) => ({ label, value: label }))

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

  // RadioControl is de "source of truth" voor woz_peildatum_jaar. registerOptions/options van
  // RadioControl staan (in de ee-ads-rhf-types) alleen string-waarden toe, maar de onderliggende
  // Controller geeft de optie-waarde ongewijzigd door aan field.onChange — dus door hier het
  // echte jaartal (number) mee te geven blijft woz_peildatum_jaar overal een number, zoals het
  // GebruikersinvoerFormValues-type verwacht. Vandaar de gerichte cast naar het (te strikte)
  // string-only optietype.
  const wozPeildatumOptions = wozWaarden.map((w) => ({
    label: `${formatPeildatum(w.peildatum)} — ${formatEuro(w.vastgestelde_waarde)}`,
    value: peildatumToJaar(w.peildatum),
  })) as unknown as { label: string; value: string }[]

  // Wanneer de gebruiker een andere peildatum kiest, volgt de WOZ-waarde daar automatisch uit
  // (maar blijft daarna nog los aanpasbaar via het WOZ-waarde-veld hieronder).
  const wozPeildatumJaar = useWatch({ control, name: "woz_peildatum_jaar" })
  useEffect(() => {
    const gekozenWozWaarde = wozWaarden.find(
      (w) => peildatumToJaar(w.peildatum) === wozPeildatumJaar,
    )
    if (!gekozenWozWaarde) return

    setValue("woz_waarde", gekozenWozWaarde.vastgestelde_waarde, {
      shouldValidate: true,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wozPeildatumJaar])

  return (
    <>
      <Grid gapVertical="large" style={{ paddingInlineStart: 0 }}>
        {wozPeildatumOptions.length > 0 && (
          <Grid.Cell span="all" appearance="transparent">
            <RadioControl<GebruikersinvoerFormValues>
              label="WOZ-peildatum"
              name="woz_peildatum_jaar"
              options={wozPeildatumOptions}
              columns={1}
              registerOptions={{ required: "WOZ-peildatum is verplicht" }}
            />
          </Grid.Cell>
        )}
        <Grid.Cell
          span={{ narrow: 4, medium: 4, wide: 4 }}
          appearance="transparent"
        >
          <TextInputControl<GebruikersinvoerFormValues>
            label="Gebruiksoppervlakte (m²)"
            name="gebruiksoppervlakte"
            attributes={{ type: "number", min: 0, step: 1 }}
            registerOptions={{
              valueAsNumber: true,
              required: "Gebruiksoppervlakte is verplicht",
              min: 0,
            }}
          />
        </Grid.Cell>

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
          />
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
          />
        </Grid.Cell>

        <Grid.Cell span="all" appearance="transparent">
          <StepActions onNextStep={onNextStep} />
        </Grid.Cell>
      </Grid>
    </>
  )
}

export default StepWoninggegevens
