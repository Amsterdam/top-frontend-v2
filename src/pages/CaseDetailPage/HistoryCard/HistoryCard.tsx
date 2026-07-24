import { Card, CaseEventTimeline } from "@/components"
import { useCaseEvents } from "@/api/hooks"
import { HistoryIcon } from "@amsterdam/design-system-react-icons"

export default function HistoryCard({ caseId }: { caseId?: number }) {
  const { data: events, isPending } = useCaseEvents(caseId)
  if (!caseId || isPending) return null

  return (
    <Card title="Zaakhistorie" icon={HistoryIcon}>
      <CaseEventTimeline data={events} />
    </Card>
  )
}
