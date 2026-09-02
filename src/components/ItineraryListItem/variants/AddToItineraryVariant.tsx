import { useEffect } from "react"
import { CheckMarkIcon, ErrorIcon } from "@amsterdam/design-system-react-icons"
import { AddToItineraryButton, useAddToItinerary } from "@/shared"
import { useVisitWrapperNotification } from "../visit"

type Props = {
  item: ItineraryItem
}

export function AddToItineraryVariant({ item }: Props) {
  const caseData = item.case
  const {
    canAdd,
    caseThemeName,
    hasItineraries,
    hasMatchingItinerary,
    onAdd,
    status,
    targetItinerary,
  } = useAddToItinerary(caseData)
  const visitWrapperNotification = useVisitWrapperNotification()

  useEffect(() => {
    if (!visitWrapperNotification) {
      return
    }

    if (!caseData) {
      visitWrapperNotification.clearNotification()
      return
    }

    if (hasItineraries && !hasMatchingItinerary) {
      visitWrapperNotification.pushNotification({
        tone: "error",
        label: `Thema ${caseThemeName} kan niet aan deze looplijst worden toegevoegd.`,
        icon: ErrorIcon,
      })
      return
    }

    if (status === "added" && targetItinerary) {
      visitWrapperNotification.pushNotification({
        tone: "success",
        label: `Toegevoegd aan ${targetItinerary.theme} – ${targetItinerary.day_settings_name}`,
        icon: CheckMarkIcon,
      })
      return
    }

    if (caseData.teams?.length) {
      visitWrapperNotification.pushNotification({
        tone: "success",
        label: `In looplijst van ${caseData.teams[0]
          .map((teamMember) => teamMember.user.full_name)
          .join(", ")}`,
        icon: CheckMarkIcon,
      })
      return
    }

    if (status === "error") {
      visitWrapperNotification.pushNotification({
        tone: "error",
        label: "Toevoegen mislukt, probeer het opnieuw.",
        icon: ErrorIcon,
      })
      return
    }

    visitWrapperNotification.clearNotification()
  }, [
    caseData,
    caseThemeName,
    hasItineraries,
    hasMatchingItinerary,
    status,
    targetItinerary,
    visitWrapperNotification,
  ])

  useEffect(() => {
    if (!visitWrapperNotification) {
      return
    }

    return () => {
      visitWrapperNotification.clearNotification()
    }
  }, [visitWrapperNotification])

  return <AddToItineraryButton canAdd={canAdd} onAdd={onAdd} status={status} />
}
