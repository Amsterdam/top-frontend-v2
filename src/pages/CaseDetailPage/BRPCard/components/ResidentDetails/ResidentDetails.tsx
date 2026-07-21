import { Row } from "@amsterdam/design-system-react"
import { Description } from "@/components"
import type { Resident } from "../../types"
import { getResidentPersonalDetails } from "../../utils/getResidentPersonalDetails"
import { getResidentFamilyDetails } from "../../utils/getResidentFamilyDetails"
import { GenderHeading } from "../GenderHeading/GenderHeading"

export function ResidentDetails({ resident }: { resident: Resident }) {
  const personalDetails = getResidentPersonalDetails(resident ?? {})
  const familyDetails = getResidentFamilyDetails(resident ?? {})

  return (
    <Row wrap gap="large">
      <div className="ams-mb-m">
        <GenderHeading resident={resident} title="Persoonsgegevens" />
        <Description termsWidth="medium" data={personalDetails} />
      </div>
      {familyDetails.length > 0 && (
        <div className="ams-mb-m">
          <GenderHeading resident={resident} title="Familiegegevens" />
          <Description termsWidth="medium" data={familyDetails} />
        </div>
      )}
    </Row>
  )
}

export default ResidentDetails
