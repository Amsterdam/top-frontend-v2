import { describe, it, expect, vi, beforeEach } from "vitest"
import { Dialog } from "@amsterdam/design-system-react"
import { useDialog } from "../useDialog"

vi.mock("@amsterdam/design-system-react", () => ({
  Dialog: {
    open: vi.fn(),
  },
}))

describe("useDialog", () => {
  const dialogId = "my-dialog"

  beforeEach(() => {
    document.body.innerHTML = ""
    vi.clearAllMocks()
  })

  it("roept Dialog.open aan met het juiste id", () => {
    const { openDialog } = useDialog(dialogId)

    openDialog()

    expect(Dialog.open).toHaveBeenCalledWith(`#${dialogId}`)
  })

  it("sluit het dialog element wanneer closeDialog wordt aangeroepen", () => {
    const dialog = document.createElement("dialog")
    dialog.id = dialogId
    dialog.close = vi.fn()
    document.body.appendChild(dialog)

    const { closeDialog } = useDialog(dialogId)

    closeDialog()

    expect(dialog.close).toHaveBeenCalled()
  })

  it("faalt niet als het dialog element niet bestaat", () => {
    const { closeDialog } = useDialog(dialogId)

    expect(() => closeDialog()).not.toThrow()
  })
})
