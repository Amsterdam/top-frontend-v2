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
  itineraryItem?: ItineraryItem,
  options?: Options,
) {
  const { itineraryId: itineraryIdFromParams } = useParams<{
    itineraryId: string
  }>()
  const itineraryId = options?.itineraryId ?? itineraryIdFromParams
  const removeItineraryItem = useRemoveItineraryItem({
    itineraryId,
    itineraryItemId: itineraryItem?.id,
  })
  const { showToast } = useToast()
  const dialogId = `delete-itinerary-item-${itineraryItem?.id ?? "unknown"}`
  const { openDialog, closeDialog } = useDialog(dialogId)

  const deleteItineraryItem = async () => {
    if (!itineraryItem?.id) return

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
      content={
        <span>
          Weet je zeker dat je{" "}
          {itineraryItem?.case?.address.full_address ? (
            <strong>{itineraryItem?.case?.address.full_address}</strong>
          ) : (
            "deze zaak"
          )}{" "}
          uit je looplijst wilt verwijderen?
        </span>
      }
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
