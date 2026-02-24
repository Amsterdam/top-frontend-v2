import { Paragraph } from "@amsterdam/design-system-react"
import { useParams } from "react-router"
import {
  useItinerary,
  useItineraryItems,
  useItinerarySuggestions,
} from "@/api/hooks"
import {
  AmsterdamCrossSpinner,
  Divider,
  AnimatedItineraryListItem,
  ItineraryListItem,
  PageHeading,
} from "@/components"
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
  const [data, { isBusy }] = useItinerarySuggestions(itineraryId)
  const [itinerary, { updateCache }] = useItinerary(itineraryId)
  const [, { execPost }] = useItineraryItems({ lazy: true })

  // Loading state for active POST requests
  const [loadingIds, setLoadingIds] = useState<number[]>([])

  const onAddCase = async (caseData: Case) => {
    if (!itineraryId) return

    setLoadingIds((prev) => [...prev, caseData.id])

    const position = getTopPosition(itinerary?.items)

    try {
      const resp = await execPost({
        itinerary: Number(itineraryId),
        id: caseData.id,
        position,
      })

      // Update cache
      updateCache((cache) => {
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

  if (isBusy) {
    return <AmsterdamCrossSpinner />
  }

  return (
    <>
      <PageHeading
        label="Voeg een zaak toe aan je looplijst"
        backLinkLabel="Terug"
      />
      <Paragraph>Deze zaken liggen dichtbij de adressen in je lijst:</Paragraph>
      <Divider />

      {cases.length === 0 && (
        <div style={{ marginTop: "1rem" }}>
          <Paragraph style={{ fontStyle: "italic", display: "inline" }}>
            Geen suggesties beschikbaar.
          </Paragraph>
          <span>😢</span>
        </div>
      )}

      {cases.map((caseData, index) => {
        const isAdded = itinerary?.items.some((i) => i.case.id === caseData.id)
        const isLoading = loadingIds.includes(caseData.id)
        return (
          <AnimatedItineraryListItem key={caseData.id} index={index}>
            <ItineraryListItem
              item={{ case: caseData } as ItineraryItem}
              variant="addSuggestedCase"
              onAdd={() => onAddCase(caseData)}
              status={isAdded ? "added" : isLoading ? "loading" : "idle"}
            />
          </AnimatedItineraryListItem>
        )
      })}
    </>
  )
}
