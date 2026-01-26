import { Column, Button } from "@amsterdam/design-system-react"
import { PlusIcon } from "@amsterdam/design-system-react-icons"

type Props = {
  item: ItineraryItem
  onAdd?: (caseData: Case) => void
}

export function AddStartAddressVariant({ item, onAdd }: Props) {
  const caseData = item.case

  return (
    <Column alignHorizontal="end">
      <Button
        icon={PlusIcon}
        iconBefore
        variant="secondary"
        title="Adres toevoegen aan looplijst"
        onClick={() => onAdd?.(caseData!)}
      >
        Toevoegen
      </Button>
    </Column>
  )
}
