import {
  Button,
  Column,
  Heading,
  Paragraph,
  Row,
} from "@amsterdam/design-system-react"
import { formatAddress, getSchedulePriority, getWorkflowName } from "@/shared"
import { PlusIcon, TrashBinIcon } from "@amsterdam/design-system-react-icons"
import { StatusTag, PriorityTag, Note, Tag } from "@/components"

type Props = {
  item: ItineraryItem
  type?: "default" | "addStartAddress"
  onClickAddStartAddress?: (caseData: Case) => void
}

export function ItineraryListItem({
  item,
  type = "default",
  onClickAddStartAddress,
}: Props) {
  const caseData = item.case
  const address = caseData?.address

  const statusName = getWorkflowName(caseData?.workflows)
  const priority = getSchedulePriority(caseData?.schedules)
  const firstVisit = item?.visits?.length ? item.visits[0] : null
  const notes = firstVisit?.personal_notes

  return (
    <Column style={{ padding: "16px" }} gap="small">
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
          <Column>
            <Button
              icon={PlusIcon}
              variant="secondary"
              title="Adres toevoegen aan looplijst"
              onClick={() => onClickAddStartAddress?.(caseData!)}
            />
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
