import { useState } from "react"

type Options<T> = {
  /** The number of rooms currently in the list (useFieldArray's fields.length). */
  count: number
  append: (room: T) => void
  remove: (index: number) => void
  /** The room's current values, to restore when editing it is cancelled. */
  getRoom: (index: number) => T
  /** Puts the room's values from before editing back (and clears its errors). */
  restore: (index: number, room: T) => void
}

/**
 * Which room in a useFieldArray list is open as an editable form, as opposed to a row in the
 * list. Adding a room while the open one is still an unsaved draft replaces that draft, so
 * repeatedly clicking a type button can't pile up unsaved rooms; only rooms that were actually
 * saved end up in the list. Cancelling drops a draft, or undoes the edits of a saved room.
 */
export function useOpenRoom<T>({
  count,
  append,
  remove,
  getRoom,
  restore,
}: Options<T>) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [isDraftOpen, setIsDraftOpen] = useState(false)
  // A copy, since react-hook-form updates the nested values in place while editing.
  const [roomBeforeEdit, setRoomBeforeEdit] = useState<T | null>(null)

  const add = (room: T) => {
    const replacesDraft = openIndex !== null && isDraftOpen
    if (replacesDraft) {
      remove(openIndex)
    }
    append(room)
    setOpenIndex(replacesDraft ? count - 1 : count)
    setIsDraftOpen(true)
    setRoomBeforeEdit(null)
  }

  const edit = (index: number) => {
    setOpenIndex(index)
    setIsDraftOpen(false)
    setRoomBeforeEdit(structuredClone(getRoom(index)))
  }

  const save = () => {
    setOpenIndex(null)
    setIsDraftOpen(false)
    setRoomBeforeEdit(null)
  }

  const cancel = () => {
    if (openIndex !== null) {
      if (isDraftOpen) {
        remove(openIndex)
      } else if (roomBeforeEdit) {
        restore(openIndex, roomBeforeEdit)
      }
    }
    save()
  }

  const removeRoom = (index: number) => {
    remove(index)
    setOpenIndex((current) => {
      if (current === null || index === current) return null
      return index < current ? current - 1 : current
    })
  }

  return { openIndex, add, edit, save, cancel, remove: removeRoom }
}
