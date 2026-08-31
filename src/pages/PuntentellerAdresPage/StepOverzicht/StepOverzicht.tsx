import { Grid } from "@amsterdam/design-system-react"
import {
  BedIcon,
  BuildingIcon,
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
  BUITEN_PARKEREN_FIELDS,
  KEUKEN_FIELDS,
  KLIMAAT_FIELDS,
  OVERIGE_RUIMTE_FIELDS,
  VERTREKKEN_FIELDS,
  WONINGGEGEVENS_FIELDS,
} from "../fieldDefinitions"

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

  return (
    <Grid gapVertical="large" style={{ paddingInlineStart: 0 }}>
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
        <SummarySection
          title="Vertrekken"
          icon={BedIcon}
          fields={VERTREKKEN_FIELDS}
          values={values as GebruikersinvoerFormValues}
        />
        <SummarySection
          title="Overige ruimtes"
          icon={BuildingIcon}
          fields={OVERIGE_RUIMTE_FIELDS}
          values={values as GebruikersinvoerFormValues}
        />
        <SummarySection
          title="Klimaat, buitenruimte & parkeren"
          icon={ParkingIcon}
          fields={[...KLIMAAT_FIELDS, ...BUITEN_PARKEREN_FIELDS]}
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
