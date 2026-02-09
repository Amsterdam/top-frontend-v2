import { Row } from "@amsterdam/design-system-react"
import { Card, Description, Divider } from "@/components"
import { useResidentDescription } from "./hooks/useResidentDescription"
import PersonHeader from "./PersonHeader"
import type { Resident } from "./types"

export function BRPPersonCard({ resident }: { resident: Resident }) {
  const descriptionData = useResidentDescription(resident ?? {})

  return (
    <>
      <PersonHeader resident={resident} />
      {/* <Description termsWidth="wide" data={descriptionData} /> */}
      <Divider />
    </>
  )
}

export default BRPPersonCard
