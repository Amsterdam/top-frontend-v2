import { Dialog } from "@amsterdam/design-system-react"

type VoidFunction = () => void

type DialogHandlers = {
  openDialog: VoidFunction
  closeDialog: VoidFunction
}

export const useDialog = (id: string): DialogHandlers => {
  const openDialog = () => {
    Dialog.open(`#${id}`)
  }

  const closeDialog: VoidFunction = () => {
    const dialogElement = document.getElementById(
      id
    ) as HTMLDialogElement | null
    dialogElement?.close()
  }

  return { openDialog, closeDialog }
}
