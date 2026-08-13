import { useDeleteItinerary } from "@/api/hooks"
import { ConfirmDialog } from "@/components"
import { useToast } from "@/components/toasts/useToast"
import { Button } from "@amsterdam/design-system-react"
import { DeleteIcon } from "@amsterdam/design-system-react-icons"
import { useNavigate } from "react-router"
import { useDialog } from "@/hooks/useDialog"

export function DeleteItineraryButton({
  itineraryId,
}: {
  itineraryId: string
}) {
  const deleteItinerary = useDeleteItinerary(itineraryId)
  const navigate = useNavigate()
  const { showToast } = useToast()
  const dialogId = `delete-itinerary-${itineraryId}`
  const { openDialog } = useDialog(dialogId)

  const handleDelete = () => {
    deleteItinerary.mutate(undefined, {
      onSuccess: () => {
        showToast({
          title: "Looplijst verwijderd",
          description: "De looplijst is succesvol verwijderd.",
          severity: "success",
        })
        navigate("/lijst-instellingen")
      },
    })
  }

  return (
    <>
      <Button icon={DeleteIcon} onClick={openDialog} variant="secondary">
        Verwijder looplijst
      </Button>
      <ConfirmDialog
        id={dialogId}
        title="Looplijst verwijderen"
        content={
          <span>Weet je zeker dat je de looplijst wilt verwijderen?</span>
        }
        onOk={handleDelete}
        onOkText="Verwijderen"
        loading={deleteItinerary.isPending}
      />
    </>
  )
}

export default DeleteItineraryButton
