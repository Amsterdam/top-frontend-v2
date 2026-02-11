import { Card, CaseEventTimeline, HeadingWithIcon } from "@/components"
import { useCaseEvents } from "@/api/hooks"
import { HistoryIcon } from "@/icons"

export default function HistoryCard({ caseId }: { caseId?: number }) {
  const [events] = useCaseEvents(caseId)

  return (
    <Card
      title={
        <HeadingWithIcon
          label="Zaakhistorie"
          iconComponent={<HistoryIcon width={19} height={19} />}
          highlightIcon
        />
      }
    >
      <CaseEventTimeline data={events} />
    </Card>
  )
}
