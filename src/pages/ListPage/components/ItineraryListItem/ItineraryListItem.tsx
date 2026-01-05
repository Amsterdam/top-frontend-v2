import {
  Button,
  Column,
  Heading,
  Paragraph,
  Row,
} from "@amsterdam/design-system-react"
import { formatAddress, getWorkflowName } from "./utils"
import { PlusIcon, TrashBinIcon } from "@amsterdam/design-system-react-icons"
import { Tag, StatusTag, PriorityTag, Note } from "@/components"

type Props = {
  item: ItineraryItem
  type?: "default" | "addAddress"
}

export function ItineraryListItem({ item, type = "default" }: Props) {
  const caseData = item.case
  const address = caseData?.address

  const statusName = getWorkflowName(caseData?.workflows?.[0])

  const schedules = caseData?.schedules
  const priority =
    schedules && schedules.length > 0 ? schedules[0]?.priority : undefined
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
        {type === "addAddress" && (
          <Column>
            <Button
              icon={PlusIcon}
              variant="secondary"
              title="Adres toevoegen aan looplijst"
            />
          </Column>
        )}
      </Row>
      <Row>
        <StatusTag statusName={statusName} />
        <PriorityTag priority={priority} />

        {caseData?.tags?.map((tag) => (
          <Tag key={tag.id} color="green" name={tag.name} />
        ))}
      </Row>
      <Note note={notes} />
    </Column>
  )
}

export default ItineraryListItem
