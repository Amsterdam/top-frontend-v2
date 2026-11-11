import { Button, IconButton } from "@amsterdam/design-system-react"
import { DeleteIcon } from "@amsterdam/design-system-react-icons"
import { BREAKPOINTS, useMediaQuery } from "@/hooks"

type Props = {
  /** Opens the page's DeletePuntentellingDialog for this row's puntentelling. */
  onClick: () => void
}

/** A row's delete action: a button on wide screens, an icon on mobile. */
export function DeletePuntentellingButton({ onClick }: Props) {
  const isMobile = useMediaQuery(BREAKPOINTS.md)

  return isMobile ? (
    <IconButton label="Verwijderen" svg={DeleteIcon} onClick={onClick} />
  ) : (
    <Button type="button" variant="tertiary" onClick={onClick}>
      Verwijderen
    </Button>
  )
}
