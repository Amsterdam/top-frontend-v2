import { Paragraph } from "@amsterdam/design-system-react"
import { DocumentCheckMarkIcon } from "@amsterdam/design-system-react-icons"
import { Card, HeadingWithIcon } from "@/components"
import { usePermits } from "@/api/hooks"
import Permit from "./Permit/Permit"
import { sortPermits } from "./utils"

type Props = {
  bagId?: string
}

export default function PermitsCard({ bagId }: Props) {
  const [permits, { isBusy }] = usePermits(bagId)

  if (!bagId || isBusy) return null

  const sortedPermits = (permits ?? []).sort(sortPermits)

  return (
    <Card
      title={
        <HeadingWithIcon
          label={`Vergunningen (${sortedPermits.length})`}
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
          <Permit key={`${permit.kenmerk}-${index}`} permit={permit} />
        ))
      )}
    </Card>
  )
}
