import { Column, Grid, Heading } from "@amsterdam/design-system-react"

import { useItinerariesSummary } from "@/api/hooks/itineraries"
import ListCard from "./ListCard"

export default function ChooseListPage() {
  const { data: itineraries } = useItinerariesSummary()
  return (
    <Grid paddingBottom="x-large" paddingTop="large">
      <Grid.Cell span="all" appearance="transparent">
        <Heading level={1}>Alle looplijsten {itineraries?.length ? `(${itineraries.length})` : ""}</Heading>
      </Grid.Cell>
      <Grid.Cell span="all" appearance="transparent">
        <Column gap="large">
        {itineraries?.map((itinerary) => (
          <ListCard key={itinerary.id} itinerary={itinerary} />
        ))}
        </Column>
      </Grid.Cell>
    </Grid>
  )
}
