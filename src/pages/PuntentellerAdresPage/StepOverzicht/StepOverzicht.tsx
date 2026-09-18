import {
  Grid,
  Heading,
  Icon,
  Paragraph,
  Row,
  UnorderedList,
} from "@amsterdam/design-system-react"
import {
  BedIcon,
  ForkAndKnifeIcon,
  HouseIcon,
  ParkingIcon,
  StarIcon,
  WaterLadderIcon,
} from "@amsterdam/design-system-react-icons"
import { useFormContext, useWatch } from "react-hook-form"
import { SummarySection } from "../components/SummarySection"
import { StepActions } from "../components/StepActions"
import {
  APART_TOILET_FIELDS,
  BADKAMER_FIELDS,
  BIJZONDERE_VOORZIENING_FIELDS,
  BINNENRUIMTES_FIELDS,
  BUITEN_PARKEREN_FIELDS,
  KEUKEN_FIELDS,
  WONINGGEGEVENS_FIELDS,
} from "../fieldDefinitions"

const jaNee = (value: string | null) => (value === "true" ? "ja" : "nee")

const BIJZONDERHEDEN_FIELDS = [
  { name: "monument", label: "Monument" },
  { name: "monument_soort", label: "Soort monument" },
  ...BIJZONDERE_VOORZIENING_FIELDS,
] as const

type Props = {
  isSubmitting?: boolean
}

export function StepOverzicht({ isSubmitting }: Props) {
  const { control } = useFormContext<GebruikersinvoerFormValues>()
  const values = useWatch({ control })
  const binnenruimtes = (values.binnenruimtes ?? []) as Binnenruimte[]

  return (
    <Grid gapVertical="large" className="align-items-end padding-Inline-start">
      <Grid.Cell span="all" appearance="transparent">
        <SummarySection
          title="Woninggegevens"
          icon={HouseIcon}
          fields={WONINGGEGEVENS_FIELDS}
          values={values as GebruikersinvoerFormValues}
        />
        <SummarySection
          title="Sanitair"
          icon={WaterLadderIcon}
          fields={[...BADKAMER_FIELDS, ...APART_TOILET_FIELDS]}
          values={values as GebruikersinvoerFormValues}
        />
        <SummarySection
          title="Keuken"
          icon={ForkAndKnifeIcon}
          fields={KEUKEN_FIELDS}
          values={values as GebruikersinvoerFormValues}
        />
        <Grid.Cell span="all" appearance="transparent">
          <Row alignVertical="center" gap="small" className="ams-mb-l">
            <Icon svg={BedIcon} size="heading-3" />
            <Heading level={3}>Binnenruimtes</Heading>
          </Row>
          {binnenruimtes.length === 0 ? (
            <Paragraph className="ams-mb-xl">
              Geen binnenruimtes toegevoegd.
            </Paragraph>
          ) : (
            <UnorderedList className="ams-mb-xl">
              {binnenruimtes.map((ruimte, index) => (
                <UnorderedList.Item key={index}>
                  {ruimte.type} — {ruimte.oppervlakte ?? 0} m², verwarmd:{" "}
                  {jaNee(ruimte.verwarmd)}, verkoeld: {jaNee(ruimte.verkoeld)}
                </UnorderedList.Item>
              ))}
            </UnorderedList>
          )}
        </Grid.Cell>
        <SummarySection
          title="Overige kenmerken binnenruimtes"
          fields={BINNENRUIMTES_FIELDS}
          values={values as GebruikersinvoerFormValues}
        />
        <SummarySection
          title="Buitenruimte & parkeren"
          icon={ParkingIcon}
          fields={BUITEN_PARKEREN_FIELDS}
          values={values as GebruikersinvoerFormValues}
        />
        <SummarySection
          title="Bijzonderheden"
          icon={StarIcon}
          fields={BIJZONDERHEDEN_FIELDS}
          values={values as GebruikersinvoerFormValues}
        />
      </Grid.Cell>

      <Grid.Cell span="all" appearance="transparent">
        <StepActions isLastStep isSubmitting={isSubmitting} />
      </Grid.Cell>
    </Grid>
  )
}

export default StepOverzicht
