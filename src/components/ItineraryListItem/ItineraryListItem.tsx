// src/components/ItineraryListItem/ItineraryListItem.tsx
import {
  Card,
  Column,
  Heading,
  Paragraph,
  Row,
} from "@amsterdam/design-system-react"
import { useNavigate, useParams } from "react-router"
import { formatAddress, getSchedulePriority, getWorkflowName } from "@/shared"
import { StatusBadge, PriorityBadge, Note, Tag } from "@/components"
import { VisitWrapper, getMostRecentVisit } from "./visit"
import { ItineraryListItemVariant } from "./ItineraryListItem.variant"
import {
  AddStartAddressVariant,
  AddSuggestedCaseVariant,
  AddToItineraryVariant,
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
  const { itineraryId } = useParams<{ itineraryId?: string }>()
  const caseData = item.case
  const address = caseData?.address

  const statusName = getWorkflowName(caseData?.workflows)
  const priority = getSchedulePriority(caseData?.schedules)

  const mostRecentVisit = getMostRecentVisit(item)
  const notes = mostRecentVisit?.personal_notes

  const onCardClick = () => {
    navigate(
      itineraryId
        ? `/looplijsten/${itineraryId}/zaken/${caseData.id}`
        : `/zaken/${caseData.id}`,
    )
  }

  const cardLink = itineraryId
    ? `/looplijsten/${itineraryId}/zaken/${caseData.id}`
    : `/zaken/${caseData.id}`

  return (
    <VisitWrapper variant={variant} item={item}>
      <Row>
        <Column gap="x-small" style={{ flexGrow: 1, flexShrink: 0 }}>
          <Heading level={3}>
            <Card.Link
              href={cardLink}
              onClick={(e) => {
                e.preventDefault()
                onCardClick()
              }}
            >
              {formatAddress(address)}
            </Card.Link>
          </Heading>
          <Paragraph>{address?.postal_code}</Paragraph>
          <Paragraph>{caseData?.reason?.name}</Paragraph>
          <Paragraph>{caseData?.project?.name}</Paragraph>
        </Column>

        <div style={{ minWidth: 0 }}>
          {variant === ItineraryListItemVariant.Default && (
            <DefaultVariant item={item} />
          )}
          {variant === ItineraryListItemVariant.AddStartAddress && (
            <AddStartAddressVariant item={item} onAdd={onAdd} />
          )}

          {variant === ItineraryListItemVariant.AddSuggestedCase && (
            <AddSuggestedCaseVariant
              item={item}
              onAdd={onAdd}
              status={status}
            />
          )}

          {variant === ItineraryListItemVariant.AddToItinerary && (
            <AddToItineraryVariant item={item} />
          )}
        </div>
      </Row>
      <div>
        <Column>
          <Row wrap className="mt-1 ">
            <StatusBadge statusName={statusName} />
            <PriorityBadge priority={priority} />
            {caseData?.tags?.map((tag) => (
              <Tag key={`${caseData.id}-${tag.id}`} label={tag.name} />
            ))}
          </Row>
          <Note note={notes} />
        </Column>
      </div>
    </VisitWrapper>
  )
}

export default ItineraryListItem
