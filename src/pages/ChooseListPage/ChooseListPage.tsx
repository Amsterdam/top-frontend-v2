import { Column } from "@amsterdam/design-system-react"

import { FootprintsIcon } from "@/icons"
import { PageHeading, Tag } from "@/components"
import { useItinerariesSummary } from "@/api/hooks/itineraries"
import ListCard from "./ListCard"

export default function ChooseListPage() {
  const [itineraries] = useItinerariesSummary()
  return (
    <Column gap="large">
      <Column gap="small">
        <PageHeading icon={<FootprintsIcon />} label="Mijn looplijsten" />
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
