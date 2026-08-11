import { Column, Icon, Paragraph, Row } from "@amsterdam/design-system-react"
import {
  ClockIcon,
  DocumentIcon,
  PersonIcon,
  PersonsIcon,
} from "@amsterdam/design-system-react-icons"
import { useCaseVisits } from "@/api/hooks"
import {
  Card,
  CardListSkeleton,
  HeadingWithIcon,
  VisitBadge,
} from "@/components"
import { formatDate } from "@/shared"

type Props = {
  caseId?: number
  loading?: boolean
}

export function LogbookCard({ caseId, loading = false }: Props) {
  const { data: caseVisits, isPending } = useCaseVisits(caseId)
  const isLoading = loading || isPending

  if (!caseId && !loading) return null

  const visits = [...(caseVisits ?? [])].sort(
    (a, b) =>
      new Date(b.start_time).getTime() - new Date(a.start_time).getTime(),
  )

  return (
    <Card
      title={isLoading ? "Logboek" : `Logboek (${visits.length})`}
      icon={ClockIcon}
      loading={isLoading}
      loadingLabel="Logboek"
      loadingBody={<CardListSkeleton items={3} linesPerItem={3} />}
    >
      {visits?.map((visit) => (
        <Column key={visit.id} gap="small">
          <Row>
            <Icon svg={ClockIcon} title="Starttijd" />
            <Paragraph className="text-bold">
              {formatDate(visit.start_time, "dd DD MMM YYYY, HH:mm")}
            </Paragraph>
          </Row>

          {visit.team_members?.slice(0, 3).map((member, idx) => (
            <Row key={idx}>
              <Icon
                svg={idx < 2 ? PersonsIcon : PersonIcon}
                title={idx < 2 ? "Toezichthouder" : "Handhaver"}
              />
              <Paragraph>{member?.user?.full_name ?? "Onbekend"}</Paragraph>
            </Row>
          ))}

          <Row>
            <VisitBadge situation={visit?.situation} />
          </Row>
          {visit.description && (
            <Column gap="small" className="mt-3">
              <Row>
                <HeadingWithIcon
                  label="Samenvatting"
                  svg={DocumentIcon}
                  level={4}
                />
              </Row>
              <Row>
                <Paragraph className="preserve-lines text-italic">
                  {visit.description}
                </Paragraph>
              </Row>
            </Column>
          )}
        </Column>
      ))}
      {visits.length === 0 && <Paragraph>Geen notities gevonden.</Paragraph>}
    </Card>
  )
}

export default LogbookCard
