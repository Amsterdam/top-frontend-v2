import type { MouseEvent, ReactNode, Ref } from "react"
import {
  Column,
  Grid,
  Heading,
  InvalidFormAlert,
  Link,
  Paragraph,
} from "@amsterdam/design-system-react"
import {
  BedIcon,
  HouseIcon,
  ParkingIcon,
  StarIcon,
} from "@amsterdam/design-system-react-icons"
import { useFormContext, useWatch } from "react-hook-form"
import { Description, type DescriptionItem } from "@/components"
import { OverzichtSection } from "../components/OverzichtSection"
import { StepActions, SUBMIT_BUTTON_ID } from "../components/StepActions"
import {
  findMissingFields,
  type MissingField,
} from "../helpers/findMissingFields"
import { getRoomLabels } from "../helpers/getRoomLabels"
import {
  formatM2,
  formatMeters,
  sumOppervlakte,
  toNumber,
} from "../helpers/oppervlakte"
import { BINNENRUIMTE_CONFIG } from "../StepBinnenruimtes/binnenruimteConfig"
import {
  JA_NEE_VRAGEN,
  MONUMENT_SOORT_OPTIONS,
  PARKEERPLEK_FIELDS,
  WONINGGEGEVENS_FIELDS,
  type FieldDefinition,
} from "../fieldDefinitions"

const jaNee = (value: unknown) =>
  value === true || value === "true" ? "Ja" : "Nee"

const monumentSoortLabel = (value: unknown) =>
  MONUMENT_SOORT_OPTIONS.find((option) => option.value === value)?.label ?? null

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
  ...(name === "gemeenschappelijke_binnenruimtes" && { format: jaNee }),
  ...(name === "energie_type" && { format: energieprestatie }),
}))

const BIJZONDERHEDEN_FIELDS: {
  name: keyof GebruikersinvoerFormValues
  label: string
  format?: (value: unknown) => ReactNode
}[] = [
  {
    name: "monument_soort",
    label: "Soort monument",
    format: monumentSoortLabel,
  },
  ...JA_NEE_VRAGEN.map(({ name, label }) => ({ name, label, format: jaNee })),
]

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
  const aantalAdressen = {
    label: "Aantal adressen",
    value: ruimte.aantal_adressen === 1 ? "1 (privé)" : ruimte.aantal_adressen,
  }

  if (ruimte.type === "Parkeerruimte") {
    return [
      aantalAdressen,
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
    aantalAdressen,
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

/**
 * Scrolls to the "Sla op en bereken" button and focuses it, so keyboard users continue from
 * there too; a plain #anchor only scrolls. The scroll is smooth, unless the user asked for
 * reduced motion.
 */
function focusSubmitButton(event: MouseEvent<HTMLAnchorElement>) {
  event.preventDefault()
  const button = document.getElementById(SUBMIT_BUTTON_ID)
  const reduceMotion = window.matchMedia?.(
    "(prefers-reduced-motion: reduce)",
  ).matches
  button?.scrollIntoView({
    block: "center",
    behavior: reduceMotion ? "auto" : "smooth",
  })
  button?.focus({ preventScroll: true })
}

type Props = {
  invoerwaarden?: PuntentellerInvoerwaarden
  isSubmitting?: boolean
  /** Opens the step of a missing field and focuses it; the field isn't rendered here. */
  onGoToField: (field: MissingField) => void
  /** Lets the page focus the InvalidFormAlert when saving is blocked by missing fields. */
  invalidFormAlertRef?: Ref<HTMLDivElement>
}

export function StepOverzicht({
  invoerwaarden,
  isSubmitting,
  onGoToField,
  invalidFormAlertRef,
}: Props) {
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
        <Paragraph>
          Controleer de ingevoerde gegevens. Klopt alles? Kies dan{" "}
          <Link href={`#${SUBMIT_BUTTON_ID}`} onClick={focusSubmitButton}>
            Sla op en bereken
          </Link>{" "}
          om de punten voor deze woning te berekenen.
        </Paragraph>
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

          data={toItems(BIJZONDERHEDEN_FIELDS, values)}
        />
      </OverzichtSection>

      <Grid.Cell span="all" appearance="transparent">
        <StepActions isLastStep isSubmitting={isSubmitting} />
      </Grid.Cell>
    </>
  )
}

export default StepOverzicht
