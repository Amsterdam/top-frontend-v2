import { Button, IconButton } from "@amsterdam/design-system-react"
import { EditIcon } from "@amsterdam/design-system-react-icons"
import { BREAKPOINTS, useMediaQuery } from "@/hooks"

type Props = {
  /** Opens this row's puntentelling in the wizard. */
  onClick: () => void
}

/** A row's edit action: a button on wide screens, an icon on mobile. */
export function EditPuntentellingButton({ onClick }: Props) {
  const isMobile = useMediaQuery(BREAKPOINTS.md)

  return isMobile ? (
    <IconButton label="Bewerken" svg={EditIcon} onClick={onClick} />
  ) : (
    <Button type="button" variant="tertiary" onClick={onClick}>
      Bewerken
    </Button>
  )
}
