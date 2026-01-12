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
  ItineraryListItem,
  PageHeading,
} from "@/components"
import { useState } from "react"

export default function SuggestionPage() {
  const { itineraryId } = useParams<{ itineraryId: string }>()
  const [data, { isBusy }] = useItinerarySuggestions(itineraryId)
  const [itinerary, { updateCache }] = useItinerary(itineraryId)
  const [, { execPost }] = useItineraryItems({ lazy: true })

  // Alleen loading state voor actieve POST requests
  const [loadingIds, setLoadingIds] = useState<number[]>([])

  const onAddCase = async (caseData: Case) => {
    if (!itineraryId) return

    setLoadingIds((prev) => [...prev, caseData.id])

    try {
      const resp = await execPost({
        itinerary: Number(itineraryId),
        id: caseData.id,
      })

      // Update cache
      updateCache((cache) => {
        if (!cache || !resp?.id) return
        cache.items.push({
          case: caseData,
          id: resp.id,
          notes: [],
          visits: [],
          position: cache.items.length + 1,
        })
      })
    } catch (error) {
      console.error("Error adding case to itinerary:", error)
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
        <div style={{ marginTop: 16 }}>
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
          <div
            key={caseData.id}
            className="animate-slide-in-left"
            style={{
              animationDelay: `${index * 0.1}s`,
              borderBottom: "1px solid var(--ams-color-separator)",
              marginBottom: 2,
            }}
          >
            <ItineraryListItem
              key={caseData.id}
              item={{ case: caseData } as ItineraryItem}
              type="addSuggestedCase"
              onAdd={() => onAddCase(caseData)}
              status={isAdded ? "added" : isLoading ? "loading" : "idle"}
            />
          </div>
        )
      })}
    </>
  )
}
