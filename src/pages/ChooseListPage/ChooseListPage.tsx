import { Column, Heading } from "@amsterdam/design-system-react"

import { Tag } from "@/components"
import { useItinerariesSummary } from "@/api/hooks/itineraries"
import ListCard from "./ListCard"

export default function ChooseListPage() {
  const { data: itineraries } = useItinerariesSummary()
  return (
    <Column gap="large">
      <Column gap="small">
        <Heading level={2}>Mijn looplijsten</Heading>
        <Tag name={`${itineraries?.length ?? ""} actieve lijsten`} />
      </Column>
      <Column gap="small">
        {itineraries?.map((itinerary) => (
          <ListCard key={itinerary.id} itinerary={itinerary} />
        ))}
      </Column>
    </Column>
  )
}
