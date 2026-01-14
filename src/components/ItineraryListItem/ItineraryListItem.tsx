import {
  Button,
  Column,
  Heading,
  Icon,
  Paragraph,
  Row,
} from "@amsterdam/design-system-react"
import {
  CheckMarkIcon,
  PlusIcon,
  SettingsIcon,
  TrashBinIcon,
} from "@amsterdam/design-system-react-icons"
import { formatAddress, getSchedulePriority, getWorkflowName } from "@/shared"
import { StatusTag, PriorityTag, Note, Tag, Distance } from "@/components"

type Props = {
  item: ItineraryItem
  type?: "default" | "addStartAddress" | "addSuggestedCase"
  onAdd?: (caseData: Case) => void
  status?: "idle" | "loading" | "added" | "error"
}

export function ItineraryListItem({
  item,
  type = "default",
  onAdd,
  status,
}: Props) {
  const caseData = item.case
  const address = caseData?.address

  const statusName = getWorkflowName(caseData?.workflows)
  const priority = getSchedulePriority(caseData?.schedules)
  const firstVisit = item?.visits?.length ? item.visits[0] : null
  const notes = firstVisit?.personal_notes

  return (
    <Column style={{ padding: "16px 0" }} gap="small">
      <Row align="between">
        <Column gap="x-small" alignHorizontal="start">
          <Heading level={3}>{formatAddress(address)}</Heading>
          <Paragraph>{address?.postal_code}</Paragraph>
          <Paragraph>{caseData?.reason?.name}</Paragraph>
          <Paragraph>{caseData?.project?.name}</Paragraph>
        </Column>
        {type === "default" && (
          <Column alignHorizontal="end">
            <Button>Bezoek</Button>
            <Button icon={TrashBinIcon} variant="secondary" />
          </Column>
        )}
        {type === "addStartAddress" && (
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
        )}
        {type === "addSuggestedCase" && (
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
        )}
      </Row>
      <Row>
        <StatusTag statusName={statusName} />
        <PriorityTag priority={priority} />
        {caseData?.tags?.map((tag) => (
          <Tag key={`${caseData.id}-${tag.id}`} color="green" name={tag.name} />
        ))}
      </Row>
      <Note note={notes} />
    </Column>
  )
}

export default ItineraryListItem
