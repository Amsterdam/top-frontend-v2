import { useParams } from "react-router"
import { useRemoveItineraryItem } from "@/api/hooks"
import { useToast } from "@/components/toasts/useToast"
import { useDialog } from "@/hooks/useDialog"
import { ConfirmDialog } from "@/components"

type Options = {
  itineraryId?: string
  onSuccess?: () => void
}

export function useDeleteItineraryItem(
  itineraryItemId?: number,
  options?: Options,
) {
  const { itineraryId: itineraryIdFromParams } = useParams<{
    itineraryId: string
  }>()
  const itineraryId = options?.itineraryId ?? itineraryIdFromParams
  const removeItineraryItem = useRemoveItineraryItem({
    itineraryId,
    itineraryItemId,
  })
  const { showToast } = useToast()
  const dialogId = `delete-itinerary-item-${itineraryItemId ?? "unknown"}`
  const { openDialog, closeDialog } = useDialog(dialogId)

  const deleteItineraryItem = async () => {
    if (!itineraryItemId) return

    await removeItineraryItem.mutateAsync()
    closeDialog()
    showToast({
      title: "Zaak verwijderd",
      description: "De zaak is succesvol uit je looplijst verwijderd.",
      severity: "success",
    })
    options?.onSuccess?.()
  }

  const dialog = (
    <ConfirmDialog
      id={dialogId}
      title="Zaak verwijderen"
      content="Weet je zeker dat je deze zaak uit je looplijst wilt verwijderen?"
      onOk={deleteItineraryItem}
      onOkText="Verwijderen"
      loading={removeItineraryItem.isPending}
    />
  )

  return {
    deleteItineraryItem: openDialog,
    isBusy: removeItineraryItem.isPending,
    dialog,
  }
}
