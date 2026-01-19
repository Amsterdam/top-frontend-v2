import { useItineraryItem } from "@/api/hooks"
import { ConfirmDialog } from "@/components"
import { useAlert } from "@/components/alerts/useAlert"
import { IconButton } from "@amsterdam/design-system-react"
import { TrashBinIcon } from "@amsterdam/design-system-react-icons"
import { useNavigate } from "react-router"
import { useDialog } from "@/hooks/useDialog"

export function DeleteItineraryItemButton({
  itineraryItemId,
}: {
  itineraryItemId: string
}) {
  const [, { execDelete, isBusy }] = useItineraryItem(itineraryItemId, { lazy: true })
  const navigate = useNavigate()
  const { showAlert } = useAlert()
  const dialogId = `delete-itinerary-item-${itineraryItemId}`
  const { openDialog } = useDialog(dialogId)

  const deleteItineraryItem = async () => {
    execDelete({
      clearCacheKeys: ["/itineraries/",`/itineraries/summary`],
    }).then(() => {
      showAlert({
        title: "Zaak verwijderd",
        description: "De zaak is succesvol verwijderd uit de looplijst.",
        severity: "success",
      })
      navigate("/")
    })
  }

  return (
    <>
      <IconButton
        svg={TrashBinIcon}
        label="Verwijder looplijst item"
        title="Verwijder looplijst item"
        size="heading-1"
        onClick={openDialog}
      />
      <ConfirmDialog
        id={dialogId}
        title="Looplijst item verwijderen"
        content={<span>Weet u zeker dat u deze zaak uit de looplijst wilt verwijderen?</span>}
        onOk={deleteItineraryItem}
        onOkText="Verwijderen"
        loading={isBusy}
      />
    </>
  )
}

export default DeleteItineraryItemButton
