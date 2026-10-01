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
  canAdd: boolean
  hasItineraries: boolean
  hasItinerariesSummarySuccess: boolean
  isAlreadyInTargetItinerary: boolean
  onAdd: () => Promise<void>
  status: AddToItineraryStatus
  targetItinerary?: ItinerarySummary
}

export function useAddToItinerary(caseData?: Case): AddToItinerary {
  const { data: itineraries, isSuccess: hasItinerariesSummarySuccess } =
    useItinerariesSummary()
  const { mutateAsync: createItineraryItem } = useCreateItineraryItem()
  const [statusState, setStatusState] = useState<StatusState>({
    value: "idle",
  })

  const caseId = caseData ? String(caseData.id) : undefined
  const status =
    statusState.caseId === caseId ? statusState.value : ("idle" as const)
  // A case of any theme can be added. Prefer an itinerary of the case's own
  // theme, otherwise fall back to the first itinerary.
  const targetItinerary =
    itineraries?.find(
      (itinerary) => itinerary.theme === caseData?.theme?.name,
    ) ?? itineraries?.[0]
  const { data: targetItineraryDetail, isSuccess: hasTargetItineraryDetail } =
    useItinerary(targetItinerary ? String(targetItinerary.id) : undefined)

  // Case ids come back as numeric strings from some endpoints and numbers
  // from others (despite the shared Case type claiming number), so compare
  // as strings rather than risk a Number()/string mismatch that's always false.
  const targetItineraryItems = targetItineraryDetail?.items ?? []
  const isAlreadyInTargetItinerary = targetItineraryItems.some(
    (item) => String(item.case.id) === caseId,
  )
  const hasNoTeams = !caseData?.teams?.length
  const canAdd =
    Boolean(caseData && targetItinerary && hasTargetItineraryDetail) &&
    !isAlreadyInTargetItinerary &&
    hasNoTeams

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
    canAdd,
    hasItineraries: (itineraries?.length ?? 0) > 0,
    hasItinerariesSummarySuccess,
    isAlreadyInTargetItinerary,
    onAdd,
    status,
    targetItinerary,
  }
}
