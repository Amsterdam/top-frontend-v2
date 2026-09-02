import { useState } from "react"
import {
  useCreateItineraryItem,
  useItinerariesSummary,
  useItinerary,
} from "@/api/hooks"
import { getTopPosition } from "./getTopPosition"

export type AddToItineraryStatus = "idle" | "loading" | "added" | "error"

type StatusState = {
  caseId?: string
  value: AddToItineraryStatus
}

export type AddToItinerary = {
  caseData?: Case
  caseThemeName?: string
  canAdd: boolean
  hasItineraries: boolean
  hasMatchingItinerary: boolean
  isAlreadyInTargetItinerary: boolean
  onAdd: () => Promise<void>
  status: AddToItineraryStatus
  targetItinerary?: ItinerarySummary
}

export function useAddToItinerary(caseData?: Case): AddToItinerary {
  const { data: itineraries } = useItinerariesSummary()
  const { mutateAsync: createItineraryItem } = useCreateItineraryItem()
  const [statusState, setStatusState] = useState<StatusState>({
    value: "idle",
  })

  const caseId = caseData ? String(caseData.id) : undefined
  const status =
    statusState.caseId === caseId ? statusState.value : ("idle" as const)
  const caseThemeName = caseData?.theme?.name
  const matchingItineraries = (itineraries ?? []).filter(
    (itinerary) => itinerary.theme === caseThemeName,
  )
  const targetItinerary = matchingItineraries[0]
  const { data: targetItineraryDetail, isSuccess: hasTargetItineraryDetail } =
    useItinerary(targetItinerary ? String(targetItinerary.id) : undefined)

  // Case ids come back as numeric strings from some endpoints and numbers
  // from others (despite the shared Case type claiming number), so compare
  // as strings rather than risk a Number()/string mismatch that's always false.
  const isAlreadyInTargetItinerary = caseData
    ? (targetItineraryDetail?.items.some(
        (item) => String(item.case.id) === String(caseData.id),
      ) ?? false)
    : false
  const canAdd =
    Boolean(caseData && targetItinerary && hasTargetItineraryDetail) &&
    !isAlreadyInTargetItinerary &&
    (!caseData?.teams || caseData.teams.length === 0)

  const onAdd = async () => {
    if (!caseData || !targetItinerary || isAlreadyInTargetItinerary) return

    setStatusState({ caseId, value: "loading" })
    try {
      await createItineraryItem({
        itinerary: targetItinerary.id,
        id: caseData.id,
        position: getTopPosition(targetItineraryDetail?.items),
        case: caseData,
      })
      setStatusState({ caseId, value: "added" })
    } catch {
      setStatusState({ caseId, value: "error" })
    }
  }

  return {
    caseData,
    caseThemeName,
    canAdd,
    hasItineraries: (itineraries?.length ?? 0) > 0,
    hasMatchingItinerary: matchingItineraries.length > 0,
    isAlreadyInTargetItinerary,
    onAdd,
    status,
    targetItinerary,
  }
}
