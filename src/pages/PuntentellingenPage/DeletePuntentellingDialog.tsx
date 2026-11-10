import { useDeletePuntentelling } from "@/api/hooks"
import { ConfirmDialog } from "@/components"
import { useToast } from "@/components/toasts/useToast"
import { useDialog } from "@/hooks/useDialog"
import { formatPunten } from "@/shared/formatPunten"

export const DELETE_PUNTENTELLING_DIALOG_ID = "verwijder-puntentelling"

type Props = {
  bagId?: string
  /** The puntentelling to delete; set by the row whose delete button opened the dialog. */
  puntentelling?: Puntentelling
}

/**
 * Confirms and deletes a puntentelling. One dialog for the whole table, outside the rows: a
 * row disappears once the list is refetched, and with it anything rendered inside it.
 */
export function DeletePuntentellingDialog({ bagId, puntentelling }: Props) {
  const deletePuntentelling = useDeletePuntentelling(bagId)
  const { showToast } = useToast()
  const { closeDialog } = useDialog(DELETE_PUNTENTELLING_DIALOG_ID)

  // "T. Toezicht (151,25 punten)", or just "142 punten" once the author no longer exists.
  const punten = puntentelling && `${formatPunten(puntentelling.punten)} punten`
  const omschrijving = puntentelling?.author
    ? `${puntentelling.author.full_name} (${punten})`
    : punten

  // mutateAsync rather than mutate's callbacks: deleting the last puntentelling empties the list,
  // so the page redirects to a new one and unmounts, and mutate's callbacks would no longer run.
  const handleDelete = async () => {
    if (!puntentelling) return

    try {
      await deletePuntentelling.mutateAsync(puntentelling.id)
    } catch {
      showToast({
        title: "Verwijderen mislukt",
        description:
          "Er is iets misgegaan bij het verwijderen. Probeer het opnieuw.",
        severity: "error",
      })
      return
    }

    closeDialog()
    showToast({
      title: "Puntentelling verwijderd",
      description: "De puntentelling is verwijderd.",
      severity: "success",
    })
  }

  return (
    <ConfirmDialog
      id={DELETE_PUNTENTELLING_DIALOG_ID}
      title="Puntentelling verwijderen"
      content={
        <span>
          Weet je zeker dat je de puntentelling van{" "}
          <strong>{omschrijving}</strong> wilt verwijderen?
        </span>
      }
      onOk={() => void handleDelete()}
      onOkText="Verwijderen"
      loading={deletePuntentelling.isPending}
    />
  )
}
