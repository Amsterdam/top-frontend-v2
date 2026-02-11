import { Card, CaseEventTimeline, HeadingWithIcon } from "@/components"
import { useCaseEvents } from "@/api/hooks"
import { HistoryIcon } from "@amsterdam/design-system-react-icons"

export default function HistoryCard({ caseId }: { caseId?: number }) {
  const [events, { isBusy }] = useCaseEvents(caseId)
  if (!caseId || isBusy) return null

  return (
    <Card
      title={
        <HeadingWithIcon label="Zaakhistorie" svg={HistoryIcon} highlightIcon />
      }
      className="animate-scale-in-center"
    >
      <CaseEventTimeline data={events} />
    </Card>
  )
}
