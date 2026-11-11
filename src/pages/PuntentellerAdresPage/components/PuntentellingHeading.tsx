import { Badge, Button, Heading, Row } from "@amsterdam/design-system-react"
import { CheckMarkIcon } from "@amsterdam/design-system-react-icons"
import { useHasUnsavedChanges } from "../helpers/useHasUnsavedChanges"

type Props = {
  adres: string
  /** Whether the saved puntentelling is definitief; none for a new, unsaved one. */
  completed?: boolean
  /** The payload of the last save; see useHasUnsavedChanges. */
  savedPayload?: string
  onMaakDefinitief: () => void
  isMakingDefinitief: boolean
}

/**
 * The page heading with the puntentelling's status: a Concept badge while it's a saved concept,
 * like in the overview, and "Maak definitief". That's only offered while the form is as it was
 * saved, so what becomes definitief is the resultaat that goes with it. Saving again makes it a
 * concept again, so there's no way back needed.
 */
export function PuntentellingHeading({
  adres,
  completed,
  savedPayload,
  onMaakDefinitief,
  isMakingDefinitief,
}: Props) {
  const hasUnsavedChanges = useHasUnsavedChanges(savedPayload)
  const isConcept = completed === false

  return (
    <Row align="between" alignVertical="center" wrap>
      <Row gap="small" alignVertical="center" wrap>
        <Heading level={1}>Puntentelling {adres && `(${adres})`}</Heading>
        {isConcept && <Badge label="Concept" color="orange" />}
      </Row>
      {isConcept && (
        <Button
          type="button"
          icon={CheckMarkIcon}
          iconBefore
          onClick={onMaakDefinitief}
          disabled={isMakingDefinitief}
          // Hidden rather than left out while there are unsaved changes: the button is taller
          // than the heading, so the row would shrink and the page jump with every change.
          // `visibility: hidden` keeps its space, but takes it out of sight, focus and the
          // accessibility tree.
          style={hasUnsavedChanges ? { visibility: "hidden" } : undefined}
        >
          Maak definitief
        </Button>
      )}
    </Row>
  )
}
