import { useParams } from "react-router"
import { useCompleteVisit } from "@/api/hooks"
import { ConfirmDialog } from "@/components"
import { useToast } from "@/components/toasts/useToast"
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
  const completeVisit = useCompleteVisit({
    visitId,
    itineraryId,
    itineraryItemId,
  })
  const { showToast } = useToast()
  const dialogId = `complete-visit-${visitId}`
  const { openDialog, closeDialog } = useDialog(dialogId)

  const handleComplete = () => {
    completeVisit.mutate(
      { completed: true },
      {
        onSuccess: ({ queued }) => {
          showToast({
            title: queued ? "Bezoek offline afgerond" : "Bezoek afgerond",
            description: queued
              ? "De afronding is lokaal opgeslagen en wordt automatisch gesynchroniseerd zodra je weer online bent."
              : "Het bezoek is succesvol afgerond.",
            severity: "success",
          })
          closeDialog()
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
