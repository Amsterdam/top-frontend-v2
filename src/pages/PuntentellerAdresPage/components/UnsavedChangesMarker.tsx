import { Icon } from "@amsterdam/design-system-react"
import { WarningFillIcon } from "@amsterdam/design-system-react-icons"
import { useHasUnsavedChanges } from "../helpers/useHasUnsavedChanges"
import styles from "./UnsavedChangesMarker.module.css"

type Props = {
  /** The payload of the last successful save as JSON; undefined while nothing is saved yet. */
  savedPayload?: string
}

/**
 * A warning icon after the Resultaat tab's title while the form has changed since the last save
 * (see useHasUnsavedChanges), in the colour of the UnsavedChangesAlert that tab then shows.
 * Screen readers get it as text: "Resultaat, niet actueel".
 */
export function UnsavedChangesMarker({ savedPayload }: Props) {
  const hasUnsavedChanges = useHasUnsavedChanges(savedPayload)
  if (!hasUnsavedChanges) return null

  return (
    <>
      <Icon svg={WarningFillIcon} aria-hidden className={styles.icon} />
      <span className="ams-visually-hidden">, niet actueel</span>
    </>
  )
}
