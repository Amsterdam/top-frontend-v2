import { Column, Icon, Paragraph, Row } from "@amsterdam/design-system-react"
import {
  PersonsIcon,
  PersonIcon,
  MapMarkerIcon,
} from "@amsterdam/design-system-react-icons"

type Props = {
  teamMembers: string[]
  caseCount: number
}

export function ItineraryTeamSummary({ teamMembers, caseCount }: Props) {
  const toezichthouders = teamMembers.slice(0, 2)
  const handhaver = teamMembers[2]

  return (
    <Column gap="none">
      <Row>
        <Icon svg={PersonsIcon} title="Toezichthouder" />
        <Paragraph>{toezichthouders.join(", ")}</Paragraph>
      </Row>
      {handhaver && (
        <Row>
          <Icon svg={PersonIcon} title="Handhaver" />
          <Paragraph>{handhaver}</Paragraph>
        </Row>
      )}
      <Row>
        <Icon svg={MapMarkerIcon} title="Aantal adressen" />
        <Paragraph>
          {caseCount} {caseCount === 1 ? "adres" : "adressen"}
        </Paragraph>
      </Row>
    </Column>
  )
}

export default ItineraryTeamSummary
