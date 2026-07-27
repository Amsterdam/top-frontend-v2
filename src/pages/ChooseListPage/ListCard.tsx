import { Button, Row } from "@amsterdam/design-system-react"
import { ArrowForwardIcon } from "@amsterdam/design-system-react-icons"
import { useNavigate } from "react-router"
import { Card, ItineraryTeamSummary } from "@/components"

type Props = {
  // team_members is typed as `string` in the generated schema, but the API
  // actually returns a string[]; the OpenAPI schema is stale.
  itinerary: Omit<components["schemas"]["ItinerarySummary"], "team_members"> & {
    team_members: string[]
  }
}

export function ListCard({ itinerary }: Props) {
  const navigate = useNavigate()

  return (
    <Card title={`${itinerary.theme} - ${itinerary.day_settings_name}`}>
      <Row gap="small" alignVertical="end" align="between" wrap>
        <ItineraryTeamSummary
          teamMembers={itinerary.team_members ?? []}
          caseCount={itinerary.num_cases}
        />
        <Button
          icon={ArrowForwardIcon}
          onClick={() => navigate(`/lijst/${itinerary.id}`)}
        >
          Naar lijst
        </Button>
      </Row>
    </Card>
  )
}

export default ListCard
