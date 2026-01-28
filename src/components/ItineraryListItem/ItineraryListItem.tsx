// src/components/ItineraryListItem/ItineraryListItem.tsx
import { Column, Heading, Paragraph, Row } from "@amsterdam/design-system-react"
import { useNavigate } from "react-router"
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
  const navigate = useNavigate()
  const caseData = item.case
  const address = caseData?.address

  const statusName = getWorkflowName(caseData?.workflows)
  const priority = getSchedulePriority(caseData?.schedules)

  const mostRecentVisit = getMostRecentVisit(item)
  const notes = mostRecentVisit?.personal_notes

  const onCardClick = () => {
    navigate(`/zaken/${caseData.id}`)
  }

  return (
    <VisitWrapper variant={variant} item={item}>
      <Row>
        <Column gap="x-small" style={{ flexGrow: 1 }} onClick={onCardClick}>
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
      <div onClick={onCardClick}>
        <Row wrap className="mt-1 ">
          <StatusTag statusName={statusName} />
          <PriorityTag priority={priority} />
          {caseData?.tags?.map((tag) => (
            <Tag
              key={`${caseData.id}-${tag.id}`}
              color="greyDark"
              name={tag.name}
            />
          ))}
        </Row>
        <Note note={notes} className="mt-2" />
      </div>
    </VisitWrapper>
  )
}

export default ItineraryListItem
