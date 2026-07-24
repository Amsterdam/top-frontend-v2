import {
  Column,
  Grid,
  Heading,
  Paragraph,
} from "@amsterdam/design-system-react"
import { useParams } from "react-router"
import {
  isValidCoordinates,
  useCreateItineraryItem,
  useItinerary,
  useItinerarySuggestions,
} from "@/api/hooks"
import { AmsterdamCrossSpinner, ItineraryListItem } from "@/components"
import { useGeolocation } from "@/hooks"
import { useState } from "react"

function getTopPosition(items?: { position: number }[]): number {
  if (!items || items.length === 0) {
    return 1
  }
  const lowest = Math.min(...items.map((item) => item.position))
  return lowest / 2
}

export default function SuggestionPage() {
  const { itineraryId } = useParams<{ itineraryId: string }>()
  const { lat, lng } = useGeolocation()
  const usesGeolocation = isValidCoordinates({ lat, lng })
  const { data, isPending } = useItinerarySuggestions(itineraryId, {
    lat,
    lng,
  })
  const { data: itinerary } = useItinerary(itineraryId)
  const createItineraryItem = useCreateItineraryItem(itineraryId)

  // Loading state for active POST requests
  const [loadingIds, setLoadingIds] = useState<number[]>([])

  const onAddCase = async (caseData: Case) => {
    if (!itineraryId) return

    setLoadingIds((prev) => [...prev, caseData.id])

    const position = getTopPosition(itinerary?.items)

    try {
      await createItineraryItem.mutateAsync({
        itinerary: Number(itineraryId),
        id: caseData.id,
        position,
        case: caseData,
      })
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== caseData.id))
    }
  }

  const cases = data?.cases ?? []

  if (isPending) {
    return <AmsterdamCrossSpinner />
  }

  return (
    <Grid paddingVertical="large" gapVertical="large">
      <Grid.Cell span="all" appearance="transparent">
        <Heading level={1}>Voeg een zaak toe aan je looplijst</Heading>
      </Grid.Cell>

      <Grid.Cell span="all" appearance="transparent">
        {cases.length > 0 && (
          <Paragraph>
            {usesGeolocation
              ? "Deze zaken liggen dichtbij je huidige locatie."
              : "Deze zaken liggen dichtbij de adressen in je lijst."}
          </Paragraph>
        )}
        {cases.length === 0 && (
          <Paragraph>Geen suggesties beschikbaar. 😢</Paragraph>
        )}
      </Grid.Cell>

      <Grid.Cell span="all" appearance="transparent">
        <Column gap="small">
          {cases.map((caseData) => {
            const isAdded = itinerary?.items.some(
              (i) => Number(i.case.id) === caseData.id,
            )
            const isLoading = loadingIds.includes(caseData.id)
            return (
              <ItineraryListItem
                key={caseData.id}
                item={{ case: caseData } as ItineraryItem}
                variant="addSuggestedCase"
                onAdd={() => onAddCase(caseData)}
                status={isAdded ? "added" : isLoading ? "loading" : "idle"}
              />
            )
          })}
        </Column>
      </Grid.Cell>
    </Grid>
  )
}
