import { Paragraph } from "@amsterdam/design-system-react"
import { DocumentCheckMarkIcon } from "@amsterdam/design-system-react-icons"

import { isAcceptanceOrLocalEnvironment } from "@/config/isAcceptanceOrLocalEnvironment"
import { Card, HeadingWithIcon } from "@/components"
import { usePermitsDecos } from "@/api/hooks"
import DecosPermit from "./components/DecosPermit"
import { filterKnownPermits } from "./data/utils"
import dummyDecosResponse from "./data/dummyDecosResponse"

type Props = {
  bagId?: string
}

export default function PermitsCardDecos({ bagId }: Props) {
  const [permitsDecos, { isBusy }] = usePermitsDecos(bagId)

  if (!bagId || isBusy) return null

  const isDevOrAcc = isAcceptanceOrLocalEnvironment()
  // Show dummy data if we're in dev or acceptance environment, we have a valid address, we're not currently loading data, and we didn't get any residents back from the API
  const showDummyData = isDevOrAcc && !permitsDecos?.length
  const permitsToUse = showDummyData ? dummyDecosResponse : permitsDecos
  const knownPermits = filterKnownPermits(permitsToUse)

  return (
    <Card
      title={
        <HeadingWithIcon
          label={`Vergunningen Decos (${knownPermits?.length ?? 0})`}
          svg={DocumentCheckMarkIcon}
          highlightIcon
        />
      }
      className="animate-scale-in-center"
      collapsible
    >
      {knownPermits?.length === 0 ? (
        <Paragraph>Geen Decos vergunningen gevonden.</Paragraph>
      ) : (
        knownPermits?.map((permit, index) => (
          <DecosPermit
            key={`${permit.permit_type}-${index}`}
            permit={permit}
            showDivider={index !== knownPermits.length - 1}
          />
        ))
      )}
    </Card>
  )
}
