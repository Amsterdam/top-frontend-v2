import { Card, CardListSkeleton, CaseEventTimeline } from "@/components"
import { useCaseEvents } from "@/api/hooks"
import { HistoryIcon } from "@amsterdam/design-system-react-icons"

type Props = {
  caseId?: number
  loading?: boolean
}

export default function HistoryCard({ caseId, loading = false }: Props) {
  const { data: events, isPending } = useCaseEvents(caseId)
  const isLoading = loading || isPending

  if (!caseId && !loading) return null

  return (
    <Card
      title="Zaakhistorie"
      icon={HistoryIcon}
      loading={isLoading}
      loadingLabel="Zaakhistorie"
      loadingBody={<CardListSkeleton items={4} linesPerItem={2} />}
    >
      <CaseEventTimeline data={events} />
    </Card>
  )
}
