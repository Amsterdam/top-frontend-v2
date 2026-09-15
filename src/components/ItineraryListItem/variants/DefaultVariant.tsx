import { useNavigate, useParams } from "react-router"
import { Button, Column } from "@amsterdam/design-system-react"
import { DeleteIcon, HouseIcon } from "@amsterdam/design-system-react-icons"
import { CompleteVisitButton } from "@/pages/ListPage/components/CompleteVisitButton/CompleteVisitButton"
import { useDeleteItineraryItem } from "@/pages/ListPage/hooks/useDeleteItineraryItem"
import { getMostRecentVisit, getVisitState, VisitState } from "../visit"

type Props = {
  item: ItineraryItem
}

export function DefaultVariant({ item }: Props) {
  const { itineraryId } = useParams<{ itineraryId: string }>()
  const { deleteItineraryItem, dialog } = useDeleteItineraryItem(item)
  const navigate = useNavigate()

  const caseData = item.case
  const visitState = getVisitState(item)
  const mostRecentVisit = getMostRecentVisit(item)

  return (
    <Column alignHorizontal="end">
      {visitState === VisitState.Pending && (
        <Column alignHorizontal="end">
          <Button
            onClick={() =>
              navigate(
                `/looplijsten/${itineraryId}/zaken/${caseData?.id}/bezoek/nieuw`,
              )
            }
            icon={HouseIcon}
            variant="secondary"
          >
            Bezoek
          </Button>
          <Button
            icon={DeleteIcon}
            iconOnly
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation()
              deleteItineraryItem()
            }}
          >
            Adres verwijderen
          </Button>
        </Column>
      )}
      {visitState === VisitState.InProgress && (
        <>
          <CompleteVisitButton
            visitId={mostRecentVisit?.id}
            itineraryItemId={item.id}
          />
        </>
      )}
      {dialog}
    </Column>
  )
}
