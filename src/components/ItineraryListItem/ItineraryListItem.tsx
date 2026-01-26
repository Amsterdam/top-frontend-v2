// src/components/ItineraryListItem/ItineraryListItem.tsx
import { Column, Heading, Paragraph, Row } from "@amsterdam/design-system-react"
import { formatAddress, getSchedulePriority, getWorkflowName } from "@/shared"
import { StatusTag, PriorityTag, Note, Tag } from "@/components"
import { VisitWrapper, getMostRecentVisit } from "./visit"
import { ItineraryListItemVariant } from "./ItineraryListItem.variant"
import {
  AddStartAddressVariant,
  AddSuggestedCaseVariant,
  DefaultVariant,
} from "./variants"

type Props = {
  item: ItineraryItem
  variant?: ItineraryListItemVariant
  onAdd?: (caseData: Case) => void
  status?: "idle" | "loading" | "added" | "error"
}

export function ItineraryListItem({
  item,
  variant = ItineraryListItemVariant.Default,
  onAdd,
  status,
}: Props) {
  const caseData = item.case
  const address = caseData?.address

  const statusName = getWorkflowName(caseData?.workflows)
  const priority = getSchedulePriority(caseData?.schedules)

  const mostRecentVisit = getMostRecentVisit(item)
  const notes = mostRecentVisit?.personal_notes

  return (
    <VisitWrapper variant={variant} item={item}>
      <Row align="between">
        <Column gap="x-small" alignHorizontal="start">
          <Heading level={3}>{formatAddress(address)}</Heading>
          <Paragraph>{address?.postal_code}</Paragraph>
          <Paragraph>{caseData?.reason?.name}</Paragraph>
          <Paragraph>{caseData?.project?.name}</Paragraph>
        </Column>

        {variant === ItineraryListItemVariant.Default && (
          <DefaultVariant item={item} />
        )}
        {variant === ItineraryListItemVariant.AddStartAddress && (
          <AddStartAddressVariant item={item} onAdd={onAdd} />
        )}

        {variant === ItineraryListItemVariant.AddSuggestedCase && (
          <AddSuggestedCaseVariant item={item} onAdd={onAdd} status={status} />
        )}
      </Row>
      <Row wrap className="mt-1">
        <StatusTag statusName={statusName} />
        <PriorityTag priority={priority} />
        {caseData?.tags?.map((tag) => (
          <Tag key={`${caseData.id}-${tag.id}`} color="greyDark" name={tag.name} />
        ))}
      </Row>
      <Note note={notes} />
    </VisitWrapper>
  )
}

export default ItineraryListItem
