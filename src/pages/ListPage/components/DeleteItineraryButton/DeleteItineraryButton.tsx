import { useItinerary } from "@/api/hooks"
import { ConfirmDialog } from "@/components"
import { useAlert } from "@/components/alerts/useAlert"
import { IconButton } from "@amsterdam/design-system-react"
import { TrashBinIcon } from "@amsterdam/design-system-react-icons"
import { useNavigate } from "react-router"
import { useDialog } from "@/hooks/useDialog"

export function DeleteItineraryButton({
  itineraryId,
}: {
  itineraryId: string
}) {
  const [, { execDelete, isBusy }] = useItinerary(itineraryId)
  const navigate = useNavigate()
  const { showAlert } = useAlert()
  const dialogId = `delete-itinerary-${itineraryId}`
  const { openDialog } = useDialog(dialogId)

  const deleteItinerary = async () => {
    execDelete({
      clearCacheKeys: ["/itineraries/summary"],
      skipCacheClear: true, // Prevent cache clearing /iternaries/itineraryId because ListPage is fetching it again after deletion. TODO: refactor to avoid this hack
    }).then(() => {
      showAlert({
        title: "Looplijst verwijderd",
        description: "De looplijst is succesvol verwijderd.",
        severity: "success",
      })
      navigate("/lijst-instellingen")
    })
  }

  return (
    <>
      <IconButton
        svg={TrashBinIcon}
        label="Verwijder looplijst"
        title="Verwijder looplijst"
        size="heading-1"
        onClick={openDialog}
      />
      <ConfirmDialog
        id={dialogId}
        title="Looplijst verwijderen"
        content={<span>Weet u zeker dat u de looplijst wilt verwijderen?</span>}
        onOk={deleteItinerary}
        onOkText="Verwijderen"
        loading={isBusy}
      />
    </>
  )
}

export default DeleteItineraryButton
