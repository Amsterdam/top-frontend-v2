import { Button, Row } from "@amsterdam/design-system-react"
import { CheckMarkIcon, PlusIcon } from "@amsterdam/design-system-react-icons"

type Props<T extends string> = {
  types: readonly T[]
  openType?: T
  onAdd: (type: T) => void
}

/** A row of buttons, one per ruimte type (binnen or buiten), that add/open that type when clicked. */
export function RuimteTypeButtons<T extends string>({
  types,
  openType,
  onAdd,
}: Props<T>) {
  return (
    <Row wrap>
      {types.map((type) => {
        const isOpen = type === openType
        return (
          <Button
            key={type}
            type="button"
            variant={isOpen ? "primary" : "secondary"}
            icon={isOpen ? CheckMarkIcon : PlusIcon}
            iconBefore
            onClick={() => onAdd(type)}
          >
            {type}
          </Button>
        )
      })}
    </Row>
  )
}
