import { Grid, type GridCellProps } from "@amsterdam/design-system-react"
import { Description } from "@/components"
import type { Resident } from "../../types"
import { getResidentPersonalDetails } from "../../utils/getResidentPersonalDetails"
import { getResidentFamilyDetails } from "../../utils/getResidentFamilyDetails"
import { GenderHeading } from "../GenderHeading/GenderHeading"

const GRID_CELL_SPAN: GridCellProps["span"] = {
  narrow: 4,
  medium: 4,
  wide: 6,
}

export function ResidentDetails({ resident }: { resident: Resident }) {
  const personalDetails = getResidentPersonalDetails(resident ?? {})
  const familyDetails = getResidentFamilyDetails(resident ?? {})

  return (
    <Grid>
      <Grid.Cell span={GRID_CELL_SPAN}>
        <GenderHeading resident={resident} title="Persoonsgegevens" />
        <Description termsWidth="medium" data={personalDetails} />
      </Grid.Cell>
      <Grid.Cell span={GRID_CELL_SPAN}>
        <GenderHeading resident={resident} title="Familiegegevens" />
        <Description termsWidth="medium" data={familyDetails} />
      </Grid.Cell>
    </Grid>
  )
}

export default ResidentDetails
