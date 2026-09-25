import type { MouseEvent, ReactNode } from "react"
import {
  Column,
  Grid,
  Heading,
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
  value === true || value === "true" ? "ja" : "nee"

const monumentSoortLabel = (value: unknown) =>
  MONUMENT_SOORT_OPTIONS.find((option) => option.value === value)?.label ?? null

const WONING_FIELDS: {
  name: keyof GebruikersinvoerFormValues
  label: string
  format?: (value: unknown) => ReactNode
}[] = WONINGGEGEVENS_FIELDS.map(({ name, label }) => ({
  name,
  label,
  ...(name === "gemeenschappelijke_binnenruimtes" && { format: jaNee }),
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
    value: format ? format(values[name]) : (values[name] as ReactNode),
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
  isSubmitting?: boolean
}

export function StepOverzicht({ isSubmitting }: Props) {
  const { control } = useFormContext<GebruikersinvoerFormValues>()
  const values = useWatch({ control }) as GebruikersinvoerFormValues
  const binnenruimtes = values.binnenruimtes ?? []
  const buitenruimtes = values.buitenruimtes ?? []
  const totaalBinnen = sumOppervlakte(binnenruimtes)
  const totaalBuiten = sumOppervlakte(buitenruimtes)

  return (
    <>
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
