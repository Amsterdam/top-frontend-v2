import { Grid, Heading } from "@amsterdam/design-system-react"

import { useItinerariesSummary } from "@/api/hooks/itineraries"
import ListCard from "./ListCard"

export default function ChooseListPage() {
  const { data: itineraries } = useItinerariesSummary()
  return (
    <Grid paddingBottom="x-large" paddingTop="large">
      <Grid.Cell span="all" appearance="transparent">
        <Heading level={1}>
          Alle looplijsten{" "}
          {itineraries?.length ? `(${itineraries.length})` : ""}
        </Heading>
      </Grid.Cell>
      <Grid.Subgrid span="all">
        {itineraries?.map((itinerary) => (
          <Grid.Cell span="all" key={itinerary.id}>
            <ListCard key={itinerary.id} itinerary={itinerary} />
          </Grid.Cell>
        ))}
      </Grid.Subgrid>
    </Grid>
  )
}
