import { Column, Icon, Paragraph, Row } from "@amsterdam/design-system-react"
import {
  ClockIcon,
  DocumentIcon,
  PersonIcon,
  PersonsIcon,
} from "@amsterdam/design-system-react-icons"
import { useCaseVisits } from "@/api/hooks"
import { Card, Divider, HeadingWithIcon, VisitTag } from "@/components"
import { LogbookIcon } from "@/icons"
import { formatDate } from "@/shared"

export function LogbookCard({ caseId }: { caseId?: number }) {
  const [caseVisits] = useCaseVisits(caseId)

  return (
    <Card
      title={
        <HeadingWithIcon
          label={`Logboek (${caseVisits?.length ?? 0})`}
          iconComponent={<LogbookIcon width={19} height={19} />}
          highlightIcon
        />
      }
      collapsible
    >
      {caseVisits?.map((visit, index) => (
        <Column key={visit.id} gap="small">
          <Row>
            <Icon svg={ClockIcon} title="Starttijd" />
            <Paragraph>
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
            <VisitTag situation={visit?.situation} />
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
                <Paragraph className="preserve-lines italic-text">
                  {visit.description}
                </Paragraph>
              </Row>
            </Column>
          )}
          {index !== caseVisits.length - 1 && <Divider margin="medium" />}
        </Column>
      ))}
    </Card>
  )
}

export default LogbookCard
