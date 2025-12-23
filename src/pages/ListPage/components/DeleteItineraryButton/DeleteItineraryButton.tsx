import { useDeleteItinerary } from "@/api/hooks"
import { ConfirmDialog } from "@/components"
import { useAlert } from "@/components/alerts/useAlert"
import { IconButton } from "@amsterdam/design-system-react"
import { TrashBinIcon } from "@amsterdam/design-system-react-icons"
import { useNavigate } from "react-router"
import { useDialog } from "@/hooks/useDialog"

export default function DeleteItineraryButton({
  itineraryId,
}: {
  itineraryId: string
}) {
  const [, { execDelete, isBusy }] = useDeleteItinerary(itineraryId)
  const navigate = useNavigate()
  const { showAlert } = useAlert()
  const dialogId = `delete-itinerary-${itineraryId}`
  const { openDialog } = useDialog(dialogId)

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
