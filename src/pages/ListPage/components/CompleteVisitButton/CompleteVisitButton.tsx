import { useParams } from "react-router"
import { useItinerary, useVisit } from "@/api/hooks"
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
  const [, { isBusy, execPatch }] = useVisit(visitId, { lazy: true })
  const [, { updateCache }] = useItinerary(itineraryId, { lazy: true })
  const { showAlert } = useAlert()
  const dialogId = `complete-visit-${visitId}`
  const { openDialog, closeDialog } = useDialog(dialogId)

  const completeVisit = async () => {
    execPatch({ completed: true }).then(() => {
      showAlert({
        title: "Bezoek afgerond",
        description: "Het bezoek is succesvol afgerond.",
        severity: "success",
      })
      closeDialog()
      updateCache((cache) => {
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
    })
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
        onOk={completeVisit}
        onOkText="Afronden"
        loading={isBusy}
      />
    </>
  )
}

export default CompleteVisitButton
