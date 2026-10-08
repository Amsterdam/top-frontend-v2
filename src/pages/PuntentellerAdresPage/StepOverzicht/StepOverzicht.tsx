import type { MouseEvent, ReactNode, Ref } from "react"
import {
  Button,
  Column,
  Grid,
  Heading,
  InvalidFormAlert,
  Paragraph,
} from "@amsterdam/design-system-react"
import {
  BedIcon,
  HouseIcon,
  ParkingIcon,
  SaveIcon,
  StarIcon,
} from "@amsterdam/design-system-react-icons"
import { useFormContext, useWatch } from "react-hook-form"
import { Description, type DescriptionItem } from "@/components"
import { OverzichtSection } from "../components/OverzichtSection"
import {
  RESUBMIT_LABEL,
  StepActions,
  SUBMIT_LABEL,
} from "../components/StepActions"
import {
  findMissingFields,
  type MissingField,
} from "../helpers/findMissingFields"
import { getRoomLabels } from "../helpers/getRoomLabels"
import { useHasUnsavedChanges } from "../helpers/useHasUnsavedChanges"
import {
  formatM2,
  formatMeters,
  sumOppervlakte,
  toNumber,
} from "../helpers/oppervlakte"
import { BINNENRUIMTE_CONFIG } from "../StepBinnenruimtes/binnenruimteConfig"
import {
  BIJZONDERHEDEN_FIELDS,
  PARKEERPLEK_FIELDS,
  WONINGGEGEVENS_FIELDS,
  type FieldDefinition,
} from "../fieldDefinitions"

const jaNee = (value: unknown) =>
  value === true || value === "true" ? "Ja" : "Nee"

/** "Energielabel C", "Energie-index 1,45" or "Bouwjaar 1977", following energie_type. */
const energieprestatie = (
  energieType: unknown,
  values: GebruikersinvoerFormValues,
) => {
  if (energieType === "label")
    return `Energielabel ${values.energielabel_klasse}`
  if (energieType === "index") {
    const energieIndex = toNumber(values.energie_index)
    return `Energie-index ${energieIndex === null ? "" : energieIndex.toLocaleString("nl-NL")}`
  }
  return `Bouwjaar ${toNumber(values.bouwjaar) ?? ""}`
}

const WONING_FIELDS: {
  name: keyof GebruikersinvoerFormValues
  label: string
  format?: (value: unknown, values: GebruikersinvoerFormValues) => ReactNode
}[] = WONINGGEGEVENS_FIELDS.map(({ name, label }) => ({
  name,
  label,
  ...(name === "energie_type" && { format: energieprestatie }),
}))

/** The chosen option's label of a question with its own options, Ja/Nee otherwise. */
const optionLabel =
  (options?: readonly { label: string; value: string }[]) =>
  (value: unknown) =>
    options
      ? (options.find((option) => option.value === value)?.label ?? null)
      : jaNee(value)

/** The bijzonderheden in page order; a follow-up field only when it's asked. */
const bijzonderhedenFields = (
  values: GebruikersinvoerFormValues,
): typeof WONING_FIELDS =>
  BIJZONDERHEDEN_FIELDS.flatMap(
    ({ name, label, summaryLabel, options, followUp }) => [
      { name, label: summaryLabel ?? label, format: optionLabel(options) },
      ...(followUp && values[name] === "true"
        ? [{ name: followUp.name, label: followUp.label }]
        : []),
    ],
  )

const toItems = (
  fields: typeof WONING_FIELDS,
  values: GebruikersinvoerFormValues,
): DescriptionItem[] =>
  fields.map(({ name, label, format }) => ({
    label,
    value: format ? format(values[name], values) : (values[name] as ReactNode),
  }))

/** A room's voorziening (sanitair, keuken): the chosen option's label or the count, or null
 * when it's not present ("0") or not answered (""), so the Description skips it. */
const extraFieldValue = (field: FieldDefinition, value: unknown) => {
  if (!value || value === "0") return null
  if ("options" in field) {
    return field.options.find((option) => option.value === value)?.label
  }
  return value as string
}

/** How many addresses use a room; 1 means it's privé, unset counts as 1 (see
 * AantalAdressenField). */
const aantalAdressen = (ruimte: { aantal_adressen: number | null }) => {
  const aantal = Number(ruimte.aantal_adressen) || 1
  return {
    label: "Aantal adressen",
    value: aantal === 1 ? "1 (privé)" : aantal,
  }
}

/** The specificaties of one binnenruimte, only for the questions its type asks. */
function binnenruimteSpecs(ruimte: Binnenruimte): DescriptionItem[] {
  const {
    hasVerwarmd = true,
    hasVerkoeld = true,
    hasOppervlakte = true,
    extra = [],
  } = BINNENRUIMTE_CONFIG[ruimte.type]

  return [
    ...(hasOppervlakte
      ? [
          { label: "Lengte", value: formatMeters(ruimte.lengte) },
          { label: "Breedte", value: formatMeters(ruimte.breedte) },
        ]
      : []),
    ...(hasVerwarmd
      ? [{ label: "Verwarmd", value: jaNee(ruimte.verwarmd) }]
      : []),
    ...(hasVerkoeld
      ? [{ label: "Verkoeld", value: jaNee(ruimte.verkoeld) }]
      : []),
    aantalAdressen(ruimte),
    ...extra
      .flatMap((section) => section.fields)
      .map((field) => ({
        label: field.label,
        value: extraFieldValue(field, ruimte[field.name]),
      })),
  ]
}

/** The specificaties of one buitenruimte: parkeerplekken for a parkeerruimte, the
 * oppervlakte for every other type. */
function buitenruimteSpecs(ruimte: Buitenruimte): DescriptionItem[] {
  if (ruimte.type === "Parkeerruimte") {
    return [
      aantalAdressen(ruimte),
      ...PARKEERPLEK_FIELDS.map(({ name, label }) => ({
        label,
        value: ruimte[name] ?? "0",
      })),
      { label: "Laadpaal", value: ruimte.laadpaal ?? "0" },
    ]
  }

  return [
    { label: "Lengte", value: formatMeters(ruimte.lengte) },
    { label: "Breedte", value: formatMeters(ruimte.breedte) },
    aantalAdressen(ruimte),
  ]
}

/** "Slaapkamer 1 (12,5 m²)", or just the title when there's no oppervlakte (e.g. an overloop)
 * or it's 0. */
const metOppervlakte = (title: string, m2: unknown) =>
  toNumber(m2) ? `${title} (${formatM2(m2)})` : title

type RuimteSpecsProps<T extends { type: string; oppervlakte: unknown }> = {
  ruimtes: T[]
  emptyText: string
  specs: (ruimte: T) => DescriptionItem[]
}

/** Every added room of one step under its own heading, with its specificaties. */
function RuimteSpecs<T extends { type: string; oppervlakte: unknown }>({
  ruimtes,
  emptyText,
  specs,
}: RuimteSpecsProps<T>) {
  const labels = getRoomLabels(ruimtes)

  if (ruimtes.length === 0) return <Paragraph>{emptyText}</Paragraph>

  return ruimtes.map((ruimte, index) => {
    const items = specs(ruimte).filter((item) => item.value != null)
    const isLast = index === ruimtes.length - 1
    return (
      <Column
        gap="small"
        key={index}
        className={isLast ? undefined : "ams-mb-m"}
      >
        <Heading level={3}>
          {metOppervlakte(labels[index], ruimte.oppervlakte)}
        </Heading>
        {items.length > 0 ? (
          <Description termsWidth="wide" data={items} />
        ) : (
          <Paragraph>Geen specificaties.</Paragraph>
        )}
      </Column>
    )
  })
}

type Props = {
  invoerwaarden?: PuntentellerInvoerwaarden
  isSubmitting?: boolean
  /** The payload of the last successful save, see useHasUnsavedChanges. */
  savedPayload?: string
  /** Opens the step of a missing field and focuses it; the field isn't rendered here. */
  onGoToField: (field: MissingField) => void
  /** Lets the page focus the InvalidFormAlert when saving is blocked by missing fields. */
  invalidFormAlertRef?: Ref<HTMLDivElement>
}

export function StepOverzicht({
  invoerwaarden,
  isSubmitting,
  savedPayload,
  onGoToField,
  invalidFormAlertRef,
}: Props) {
  const hasUnsavedChanges = useHasUnsavedChanges(savedPayload)
  const { control } = useFormContext<GebruikersinvoerFormValues>()
  const values = useWatch({ control }) as GebruikersinvoerFormValues
  const missingFields = findMissingFields(values, invoerwaarden)

  // The InvalidFormAlert renders plain #links, but the fields sit on other steps and aren't
  // in the page, so a click opens the field's step instead.
  const goToField = (event: MouseEvent<HTMLDivElement>) => {
    const link = (event.target as HTMLElement).closest("a")
    const field = missingFields.find(
      ({ name }) => link?.getAttribute("href") === `#${name}`,
    )
    if (!field) return
    event.preventDefault()
    onGoToField(field)
  }
  const binnenruimtes = values.binnenruimtes ?? []
  const buitenruimtes = values.buitenruimtes ?? []
  const totaalBinnen = sumOppervlakte(binnenruimtes)
  const totaalBuiten = sumOppervlakte(buitenruimtes)

  return (
    <>
      {missingFields.length > 0 && (
        <Grid.Cell span="all" appearance="transparent">
          <InvalidFormAlert
            ref={invalidFormAlertRef}
            errors={missingFields.map(({ name, message }) => ({
              id: `#${name}`,
              label: message,
            }))}
            focusOnRender={false}
            headingLevel={2}
            onClick={goToField}
          />
        </Grid.Cell>
      )}

      <Grid.Cell span="all">
        <Heading level={2} className="ams-mb-m">
          Overzicht
        </Heading>
        <Paragraph className="ams-mb-m">
          {hasUnsavedChanges
            ? "Je wijzigingen zijn nog niet opgeslagen en tellen nog niet mee in het resultaat. Controleer de gegevens."
            : "Controleer de ingevoerde gegevens."}{" "}
          Klopt alles? Kies dan '
          {hasUnsavedChanges ? RESUBMIT_LABEL : SUBMIT_LABEL}' om de punten voor
          deze woning {hasUnsavedChanges ? "opnieuw " : ""}te berekenen.
        </Paragraph>
        <Button
          type="submit"
          icon={SaveIcon}
          iconBefore
          disabled={isSubmitting}
        >
          {hasUnsavedChanges ? RESUBMIT_LABEL : SUBMIT_LABEL}
        </Button>
      </Grid.Cell>

      <OverzichtSection title="Woning" icon={HouseIcon}>
        <Description termsWidth="wide" data={toItems(WONING_FIELDS, values)} />
      </OverzichtSection>

      <OverzichtSection
        title={metOppervlakte("Binnenruimtes", totaalBinnen)}
        icon={BedIcon}
      >
        <RuimteSpecs
          ruimtes={binnenruimtes}
          emptyText="Geen binnenruimtes toegevoegd."
          specs={binnenruimteSpecs}
        />
      </OverzichtSection>

      <OverzichtSection
        title={metOppervlakte("Buitenruimtes", totaalBuiten)}
        icon={ParkingIcon}
      >
        <RuimteSpecs
          ruimtes={buitenruimtes}
          emptyText="Geen buitenruimtes toegevoegd."
          specs={buitenruimteSpecs}
        />
      </OverzichtSection>

      <OverzichtSection title="Bijzonderheden" icon={StarIcon}>
        <Description
          termsWidth="wide"
          data={toItems(bijzonderhedenFields(values), values)}
        />
      </OverzichtSection>

      <Grid.Cell span="all" appearance="transparent">
        <StepActions
          isLastStep
          isSubmitting={isSubmitting}
          hasUnsavedChanges={hasUnsavedChanges}
        />
      </Grid.Cell>
    </>
  )
}

export default StepOverzicht
