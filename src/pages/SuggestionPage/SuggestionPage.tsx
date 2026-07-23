import { Grid, Heading, Paragraph } from "@amsterdam/design-system-react"
import { useParams } from "react-router"
import {
  useCreateItineraryItem,
  useItinerary,
  useItinerarySuggestions,
  useUpdateItineraryCache,
} from "@/api/hooks"
import { AmsterdamCrossSpinner, ItineraryListItem } from "@/components"
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
  const { data, isPending } = useItinerarySuggestions(itineraryId)
  const { data: itinerary } = useItinerary(itineraryId)
  const updateItineraryCache = useUpdateItineraryCache(itineraryId)
  const createItineraryItem = useCreateItineraryItem()

  // Loading state for active POST requests
  const [loadingIds, setLoadingIds] = useState<number[]>([])

  const onAddCase = async (caseData: Case) => {
    if (!itineraryId) return

    setLoadingIds((prev) => [...prev, caseData.id])

    const position = getTopPosition(itinerary?.items)

    try {
      const resp = await createItineraryItem.mutateAsync({
        itinerary: Number(itineraryId),
        id: caseData.id,
        position,
      })

      // Update cache
      updateItineraryCache((cache) => {
        if (!cache || !resp?.id) return
        cache.items.push({
          case: caseData,
          id: resp.id,
          notes: [],
          visits: [],
          position,
        })
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

      <Grid.Cell span="all">
        {cases.length === 0 && (
          <div style={{ marginTop: "1rem" }}>
            <Paragraph style={{ fontStyle: "italic", display: "inline" }}>
              Geen suggesties beschikbaar.
            </Paragraph>
            <span>😢</span>
          </div>
        )}

        {cases.length > 0 && (
          <Paragraph>Deze zaken liggen dichtbij de adressen in je lijst:</Paragraph>
        )}

        {cases.map((caseData) => {
          const isAdded = itinerary?.items.some((i) => i.case.id === caseData.id)
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
      </Grid.Cell>
    </Grid>
  )
}
