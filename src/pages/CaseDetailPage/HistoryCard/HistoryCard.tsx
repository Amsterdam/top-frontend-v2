import { Card, CaseEventTimeline } from "@/components"
import { useCaseEvents } from "@/api/hooks"
import { HistoryIcon } from "@amsterdam/design-system-react-icons"

export default function HistoryCard({ caseId }: { caseId?: number }) {
  const [events, { isBusy }] = useCaseEvents(caseId)
  if (!caseId || isBusy) return null

  return (
    <Card title="Zaakhistorie" icon={HistoryIcon}>
      <CaseEventTimeline data={events} />
    </Card>
  )
}
