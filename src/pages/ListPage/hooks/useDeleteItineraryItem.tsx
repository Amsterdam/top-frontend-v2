import { useParams } from "react-router"
import { useItinerary, useItineraryItem } from "@/api/hooks"
import { useAlert } from "@/components/alerts/useAlert"
import { useDialog } from "@/hooks/useDialog"
import { ConfirmDialog } from "@/components"

export function useDeleteItineraryItem(itineraryItemId: number) {
  const { itineraryId } = useParams<{ itineraryId: string }>()
  const [, { updateCache }] = useItinerary(itineraryId, { lazy: true })
  const [, { execDelete, isBusy }] = useItineraryItem(itineraryItemId, {
    lazy: true,
  })
  const { showAlert } = useAlert()
  const dialogId = `delete-itinerary-item-${itineraryItemId}`
  const { openDialog } = useDialog(dialogId)

  const deleteItineraryItem = async () => {
    await execDelete()
    updateCache((cache) => {
      if (!cache) return
      cache.items = cache.items.filter((item) => item.id !== itineraryItemId)
    })
    showAlert({
      title: "Zaak verwijderd",
      description: "De zaak is succesvol uit je looplijst verwijderd.",
      severity: "success",
    })
  }

  const dialog = (
    <ConfirmDialog
      id={dialogId}
      title="Zaak verwijderen"
      content="Weet je zeker dat je deze zaak uit je looplijst wilt verwijderen?"
      onOk={deleteItineraryItem}
      onOkText="Verwijderen"
      loading={isBusy}
    />
  )

  return { deleteItineraryItem: openDialog, isBusy, dialog }
}
