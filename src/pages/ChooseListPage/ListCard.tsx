import {
  Button,
  Column,
  Heading,
  Icon,
  Paragraph,
  Row,
} from "@amsterdam/design-system-react"
import {
  PersonsIcon,
  PersonIcon,
  MapMarkerIcon,
  ArrowForwardIcon,
} from "@amsterdam/design-system-react-icons"
import { useNavigate } from "react-router"
import { Card } from "@/components"

type Props = {
  itinerary: components["schemas"]["ItinerarySummary"]
}

export function ListCard({ itinerary }: Props) {
  const navigate = useNavigate()

  const teamMembers = (itinerary.team_members ?? []) as unknown as string[]
  const toezichthouders = teamMembers.slice(0, 2)
  const handhaver = teamMembers[2]

  return (
    <Card>
      <Heading level={3}>
        {itinerary.theme} - {itinerary.day_settings_name}
      </Heading>

      {toezichthouders.map((member) => (
        <Row key={member}>
          <Icon svg={PersonsIcon} title="Toezichthouder" />
          <Paragraph>{member}</Paragraph>
        </Row>
      ))}

      <Row align="between" wrap>
        <Column gap="none">
          {handhaver && (
            <Row>
              <Icon svg={PersonIcon} title="Handhaver" />
              <Paragraph>{handhaver}</Paragraph>
            </Row>
          )}

          <Row>
            <Icon svg={MapMarkerIcon} title="Aantal adressen" />
            <Paragraph>{itinerary.num_cases} adressen</Paragraph>
          </Row>
        </Column>

        <Column>
          <Button
            icon={ArrowForwardIcon}
            onClick={() => navigate(`/lijst/${itinerary.id}`)}
          >
            Naar lijst
          </Button>
        </Column>
      </Row>
    </Card>
  )
}

export default ListCard
