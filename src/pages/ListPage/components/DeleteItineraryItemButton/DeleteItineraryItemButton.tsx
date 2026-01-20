import { useParams } from "react-router"
import { useItinerary, useItineraryItem } from "@/api/hooks"
import { ConfirmDialog } from "@/components"
import { useAlert } from "@/components/alerts/useAlert"
import { Button } from "@amsterdam/design-system-react"
import { DeleteIcon } from "@amsterdam/design-system-react-icons"
import { useDialog } from "@/hooks/useDialog"

export function DeleteItineraryItemButton({
  itineraryItemId,
}: {
  itineraryItemId: number
}) {
  const { itineraryId } = useParams<{ itineraryId: string }>()
  const [, { updateCache }] = useItinerary(itineraryId, { lazy: true })
  const [, { execDelete, isBusy }] = useItineraryItem(itineraryItemId, {
    lazy: true,
  })
  const { showAlert } = useAlert()
  const dialogId = `delete-itinerary-item-${itineraryItemId}`
  const { openDialog } = useDialog(dialogId)

  const deleteItineraryItem = async () => {
    execDelete().then(() => {
      updateCache((cache) => {
        showAlert({
          title: "Zaak verwijderd",
          description: "De zaak is succesvol uit je looplijst verwijderd.",
          severity: "success",
        })
        if (!cache) return
        cache.items = cache.items.filter((item) => item.id !== itineraryItemId)
      })
    })
  }

  return (
    <>
      <Button
        icon={DeleteIcon}
        title="Verwijder zaak uit looplijst"
        onClick={openDialog}
        variant="secondary"
      />
      <ConfirmDialog
        id={dialogId}
        title="Zaak verwijderen"
        content={
          <span>
            Weet je zeker dat je deze zaak uit je looplijst wilt verwijderen?
          </span>
        }
        onOk={deleteItineraryItem}
        onOkText="Verwijderen"
        loading={isBusy}
      />
    </>
  )
}

export default DeleteItineraryItemButton
