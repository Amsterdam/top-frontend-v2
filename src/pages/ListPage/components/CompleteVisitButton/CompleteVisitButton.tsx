import { useParams } from "react-router"
import { useCompleteVisit, useUpdateItineraryCache } from "@/api/hooks"
import { ConfirmDialog } from "@/components"
import { useAlert } from "@/components/alerts/useAlert"
import { Button } from "@amsterdam/design-system-react"
import { CheckMarkIcon } from "@amsterdam/design-system-react-icons"
import { useDialog } from "@/hooks/useDialog"

export function CompleteVisitButton({
  visitId,
  itineraryItemId,
}: {
  visitId?: number
  itineraryItemId: number
}) {
  const { itineraryId } = useParams<{ itineraryId: string }>()
  const completeVisit = useCompleteVisit(visitId)
  const updateItineraryCache = useUpdateItineraryCache(itineraryId)
  const { showAlert } = useAlert()
  const dialogId = `complete-visit-${visitId}`
  const { openDialog, closeDialog } = useDialog(dialogId)

  const handleComplete = () => {
    completeVisit.mutate(
      { completed: true },
      {
        onSuccess: () => {
          showAlert({
            title: "Bezoek afgerond",
            description: "Het bezoek is succesvol afgerond.",
            severity: "success",
          })
          closeDialog()
          updateItineraryCache((cache) => {
            if (!cache) return

            const itemToUpdate = cache.items.find(
              (item) => item.id === itineraryItemId,
            )
            if (!itemToUpdate) return

            const visitToUpdate = itemToUpdate.visits.find(
              (visit) => visit.id === visitId,
            )
            if (!visitToUpdate) return

            visitToUpdate.completed = true
          })
        },
      },
    )
  }

  return (
    <>
      <Button icon={CheckMarkIcon} iconBefore onClick={openDialog}>
        Afronden
      </Button>
      <ConfirmDialog
        id={dialogId}
        title="Bezoek afronden"
        content={<span>Weet je zeker dat je dit bezoek wilt afronden?</span>}
        onOk={handleComplete}
        onOkText="Afronden"
        loading={completeVisit.isPending}
      />
    </>
  )
}

export default CompleteVisitButton
