import { Column } from "@amsterdam/design-system-react"

import { FootprintsIcon } from "@/icons"
import { Divider, PageHeading, Tag } from "@/components"
import { useItinerariesSummary } from "@/api/hooks/itineraries"
import ListCard from "./ListCard"

export default function ChooseListPage() {
  const [itineraries] = useItinerariesSummary()
  return (
    <>
      <Column gap="small">
        <PageHeading icon={<FootprintsIcon />} label="Mijn looplijsten" />
        <Tag name={`${itineraries?.length ?? ""} actieve lijsten`} />
      </Column>
      <Divider />
      <Column gap="small">
        {itineraries?.map((itinerary) => (
          <ListCard key={itinerary.id} itinerary={itinerary} />
        ))}
      </Column>
    </>
  )
}
