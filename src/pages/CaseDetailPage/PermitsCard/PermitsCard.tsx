import { Paragraph } from "@amsterdam/design-system-react"
import { DocumentCheckMarkIcon } from "@amsterdam/design-system-react-icons"

import { Card, HeadingWithIcon } from "@/components"
import { isAcceptanceOrLocalEnvironment } from "@/config/isAcceptanceOrLocalEnvironment"
import { usePermits } from "@/api/hooks"
import Permit from "./components/Permit"
import { sortPermits } from "./data/utils"
import dummyPowerBrowserResponse from "./data/dummyPowerBrowserResponse"

type Props = {
  bagId?: string
}

export default function PermitsCard({ bagId }: Props) {
  const [permits, { isBusy }] = usePermits(bagId)

  if (!bagId || isBusy) return null

  const isDevOrAcc = isAcceptanceOrLocalEnvironment()
  // Show dummy data if we're in dev or acceptance environment, we have a valid address, we're not currently loading data, and we didn't get any residents back from the API
  const showDummyData = isDevOrAcc && !permits?.length
  const permitsToUse = showDummyData ? dummyPowerBrowserResponse : permits

  const sortedPermits = (permitsToUse ?? []).sort(sortPermits)

  return (
    <Card
      title={
        <HeadingWithIcon
          label={`Vergunningen PowerBrowser (${sortedPermits.length})`}
          svg={DocumentCheckMarkIcon}
          highlightIcon
        />
      }
      className="animate-scale-in-center"
      collapsible
    >
      {sortedPermits.length === 0 ? (
        <Paragraph>Geen vergunningen gevonden.</Paragraph>
      ) : (
        sortedPermits.map((permit, index) => (
          <Permit
            key={`${permit.kenmerk}-${index}`}
            permit={permit}
            showDivider={index !== sortedPermits.length - 1}
          />
        ))
      )}
    </Card>
  )
}
