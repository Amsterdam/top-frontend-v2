import { Card, CaseEventTimeline, HeadingWithIcon } from "@/components"
import { useCaseEvents } from "@/api/hooks"
import { HistoryIcon } from "@amsterdam/design-system-react-icons"

export default function HistoryCard({ caseId }: { caseId?: number }) {
  const [events] = useCaseEvents(caseId)

  return (
    <Card
      title={
        <HeadingWithIcon label="Zaakhistorie" svg={HistoryIcon} highlightIcon />
      }
    >
      <CaseEventTimeline data={events} />
    </Card>
  )
}
