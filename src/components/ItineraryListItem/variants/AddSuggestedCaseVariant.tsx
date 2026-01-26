import {
  Column,
  Button,
  Row,
  Icon,
  Paragraph,
} from "@amsterdam/design-system-react"
import {
  CheckMarkIcon,
  PlusIcon,
  SettingsIcon,
} from "@amsterdam/design-system-react-icons"
import { Distance } from "@/components/Distance/Distance"

type Props = {
  item: ItineraryItem
  onAdd?: (caseData: Case) => void
  status?: "idle" | "loading" | "added" | "error"
}

export function AddSuggestedCaseVariant({ item, onAdd, status }: Props) {
  const caseData = item.case

  return (
    <Column alignHorizontal="end" align="between">
      {status === "added" ? (
        <Row
          align="center"
          gap="x-small"
          style={{ color: "var(--ams-color-feedback-success)" }}
        >
          <Icon svg={CheckMarkIcon} />
          <Paragraph style={{ color: "inherit" }}>Toegevoegd</Paragraph>
        </Row>
      ) : (
        <Button
          icon={status === "loading" ? SettingsIcon : PlusIcon}
          iconBefore
          variant="secondary"
          title="Zaak toevoegen aan looplijst"
          onClick={() => status === "idle" && onAdd?.(caseData!)}
          disabled={status === "loading"}
        >
          {status === "loading" ? "Toevoegen..." : "Toevoegen"}
        </Button>
      )}
      <Distance distance={caseData?.distance} />
    </Column>
  )
}
