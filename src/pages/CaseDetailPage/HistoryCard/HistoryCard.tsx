import { Card, CaseEventTimeline } from "@/components"
import { useCaseEvents } from "@/api/hooks"

export default function HistoryCard({ caseId }: { caseId?: number }) {
  const [events] = useCaseEvents(caseId)

  return (
    <Card title="Zaakhistorie">
      <CaseEventTimeline data={events} />
    </Card>
  )
}
