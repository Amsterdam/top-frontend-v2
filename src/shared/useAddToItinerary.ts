import { useState } from "react"
import {
  useCasesSearch,
  useCreateItineraryItem,
  useItinerariesSummary,
  useItinerary,
} from "@/api/hooks"
import { formatAddress } from "./formatAddress"
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
  hasItinerariesSummarySuccess: boolean
  hasMatchingItinerary: boolean
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
  const caseThemeName = caseData?.theme?.name
  const needsTeamsLookup = Boolean(caseData && caseData.teams === undefined)
  const caseAddressSearch = needsTeamsLookup
    ? formatAddress(caseData?.address)
    : ""
  const { data: casesWithTeams } = useCasesSearch(caseAddressSearch, undefined, {
    lazy: !caseAddressSearch,
  })
  const caseWithTeams = casesWithTeams?.find(
    (searchCase) => String(searchCase.id) === caseId,
  )
  const teams = caseData?.teams ?? caseWithTeams?.teams
  const matchingItineraries = (itineraries ?? []).filter(
    (itinerary) => itinerary.theme === caseThemeName,
  )
  const targetItinerary = matchingItineraries[0]
  const { data: targetItineraryDetail, isSuccess: hasTargetItineraryDetail } =
    useItinerary(targetItinerary ? String(targetItinerary.id) : undefined)

  // Case ids come back as numeric strings from some endpoints and numbers
  // from others (despite the shared Case type claiming number), so compare
  // as strings rather than risk a Number()/string mismatch that's always false.
  const targetItineraryItems = targetItineraryDetail?.items ?? []
  const isAlreadyInTargetItinerary = targetItineraryItems.some(
    (item) => String(item.case.id) === caseId,
  )
  const hasNoTeams = !teams?.length
  const hasCheckedTeams = !needsTeamsLookup || Boolean(caseWithTeams)
  const canAdd =
    Boolean(caseData && targetItinerary && hasTargetItineraryDetail) &&
    !isAlreadyInTargetItinerary &&
    hasNoTeams &&
    hasCheckedTeams

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
    caseData: caseData && teams ? { ...caseData, teams } : caseData,
    caseThemeName,
    canAdd,
    hasItineraries: (itineraries?.length ?? 0) > 0,
    hasItinerariesSummarySuccess,
    hasMatchingItinerary: matchingItineraries.length > 0,
    isAlreadyInTargetItinerary,
    onAdd,
    status,
    targetItinerary,
  }
}
