import type { ReactNode } from "react"
import {
  Column,
  Grid,
  Heading,
  Paragraph,
} from "@amsterdam/design-system-react"
import {
  BedIcon,
  HouseIcon,
  ParkingIcon,
  RulerIcon,
  StarIcon,
} from "@amsterdam/design-system-react-icons"
import { useFormContext, useWatch } from "react-hook-form"
import { Description, type DescriptionItem } from "@/components"
import { OverzichtSection } from "../components/OverzichtSection"
import { StepActions } from "../components/StepActions"
import { getRoomLabels } from "../helpers/getRoomLabels"
import { formatM2, formatMeters, sumOppervlakte } from "../helpers/oppervlakte"
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
          { label: "Oppervlakte", value: formatM2(ruimte.oppervlakte) },
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
    { label: "Oppervlakte", value: formatM2(ruimte.oppervlakte) },
    aantalAdressen,
  ]
}

type RuimteSpecsProps<T extends { type: string }> = {
  ruimtes: T[]
  emptyText: string
  specs: (ruimte: T) => DescriptionItem[]
}

/** Every added room of one step under its own heading, with its specificaties. */
function RuimteSpecs<T extends { type: string }>({
  ruimtes,
  emptyText,
  specs,
}: RuimteSpecsProps<T>) {
  const labels = getRoomLabels(ruimtes)

  if (ruimtes.length === 0) return <Paragraph>{emptyText}</Paragraph>

  return ruimtes.map((ruimte, index) => {
    const items = specs(ruimte).filter((item) => item.value != null)
    return (
      <Column gap="small" key={index}>
        <Heading level={3}>{labels[index]}</Heading>
        {items.length > 0 ? (
          <Description termsWidth="wide" data={items} />
        ) : (
          <Paragraph>Geen specificaties.</Paragraph>
        )}
      </Column>
    )
  })
}

const TotaalOppervlakte = ({ label, m2 }: { label: string; m2: number }) => (
  <Description termsWidth="wide" data={[{ label, value: formatM2(m2) }]} />
)

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
          Controleer de ingevoerde gegevens. Klopt alles? Kies dan &quot;Sla op
          en bereken&quot; om de punten voor deze woning te berekenen.
        </Paragraph>
      </Grid.Cell>

      <OverzichtSection title="Woning" icon={HouseIcon}>
        <Description termsWidth="wide" data={toItems(WONING_FIELDS, values)} />
      </OverzichtSection>

      <OverzichtSection title="Binnenruimtes" icon={BedIcon}>
        <RuimteSpecs
          ruimtes={binnenruimtes}
          emptyText="Geen binnenruimtes toegevoegd."
          specs={binnenruimteSpecs}
        />
        <TotaalOppervlakte
          label="Totale oppervlakte binnenruimtes"
          m2={totaalBinnen}
        />
      </OverzichtSection>

      <OverzichtSection title="Buitenruimtes" icon={ParkingIcon}>
        <RuimteSpecs
          ruimtes={buitenruimtes}
          emptyText="Geen buitenruimtes toegevoegd."
          specs={buitenruimteSpecs}
        />
        <TotaalOppervlakte
          label="Totale oppervlakte buitenruimtes"
          m2={totaalBuiten}
        />
      </OverzichtSection>

      <OverzichtSection title="Bijzonderheden" icon={StarIcon}>
        <Description
          termsWidth="wide"
          data={toItems(BIJZONDERHEDEN_FIELDS, values)}
        />
      </OverzichtSection>

      <OverzichtSection title="Totale oppervlakte" icon={RulerIcon}>
        <Description
          termsWidth="wide"
          data={[
            { label: "Binnenruimtes", value: formatM2(totaalBinnen) },
            { label: "Buitenruimtes", value: formatM2(totaalBuiten) },
            {
              label: "Totaal",
              value: <strong>{formatM2(totaalBinnen + totaalBuiten)}</strong>,
            },
          ]}
        />
      </OverzichtSection>

      <Grid.Cell span="all" appearance="transparent">
        <StepActions isLastStep isSubmitting={isSubmitting} />
      </Grid.Cell>
    </>
  )
}

export default StepOverzicht
