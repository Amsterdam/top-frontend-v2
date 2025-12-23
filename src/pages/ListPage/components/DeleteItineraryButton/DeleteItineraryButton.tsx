import { useDeleteItinerary } from "@/api/hooks"
import { useAlert } from "@/components/alerts/useAlert"
import { IconButton } from "@amsterdam/design-system-react"
import { TrashBinIcon } from "@amsterdam/design-system-react-icons"
import { useNavigate } from "react-router"

export default function DeleteItineraryButton({
  itineraryId,
}: {
  itineraryId: string
}) {
  const [, { execDelete }] = useDeleteItinerary(itineraryId)
  const navigate = useNavigate()
  const { showAlert } = useAlert()

  const confirmDelete = () => {
    if (
      window.confirm(
        "Weet je zeker dat je deze looplijst wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.",
      )
    ) {
      deleteItinerary()
    }
  }

  const deleteItinerary = async () => {
    execDelete({ clearCacheKeys: ["itineraries"] }).then(() => {
      showAlert({
        title: "Looplijst verwijderd",
        description: "De looplijst is succesvol verwijderd.",
        severity: "success",
      })
      navigate("/")
    })
  }

  return (
    <IconButton
      svg={TrashBinIcon}
      label="Verwijder looplijst"
      title="Verwijder looplijst"
      size="heading-1"
      onClick={confirmDelete}
    />
  )
}
