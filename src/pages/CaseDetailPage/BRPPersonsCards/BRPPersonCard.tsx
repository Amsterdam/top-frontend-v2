import { Card, Description } from "@/components"
import { useResidentDescription } from "./hooks/useResidentDescription"
import PersonHeader from "./PersonHeader"
import type { Resident } from "./types"

export function BRPPersonCard({ resident }: { resident: Resident }) {
  const descriptionData = useResidentDescription(resident ?? {})

  return (
    <Card
      title={<PersonHeader resident={resident} />}
      collapsible
      defaultOpen={false}
    >
      <Description termsWidth="wide" data={descriptionData} />
    </Card>
  )
}

export default BRPPersonCard
