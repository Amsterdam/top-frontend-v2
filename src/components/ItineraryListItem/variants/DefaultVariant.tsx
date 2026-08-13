import { useNavigate, useParams } from "react-router"
import { Button, Column } from "@amsterdam/design-system-react"
import { HouseIcon } from "@amsterdam/design-system-react-icons"
// import { EllipsisActionMenu } from "@/components/EllipsisActionMenu/EllipsisActionMenu"
import { CompleteVisitButton } from "@/pages/ListPage/components/CompleteVisitButton/CompleteVisitButton"
// import { useDeleteItineraryItem } from "@/pages/ListPage/hooks/useDeleteItineraryItem"
import { getMostRecentVisit, getVisitState, VisitState } from "../visit"

type Props = {
  item: ItineraryItem
}

export function DefaultVariant({ item }: Props) {
  const { itineraryId } = useParams<{ itineraryId: string }>()
  // const { deleteItineraryItem, dialog } = useDeleteItineraryItem(item.id)
  const navigate = useNavigate()

  const caseData = item.case
  const visitState = getVisitState(item)
  const mostRecentVisit = getMostRecentVisit(item)

  return (
    <Column alignHorizontal="end">
      {visitState === VisitState.Pending && (
        <>
          <Button
            variant="secondary"
            onClick={() => navigate(`/bezoek/${itineraryId}/${caseData?.id}`)}
            icon={HouseIcon}
          >
            Bezoek
          </Button>
        </>
      )}
      {visitState === VisitState.InProgress && (
        <>
          <CompleteVisitButton
            visitId={mostRecentVisit?.id}
            itineraryItemId={item.id}
          />
        </>
      )}
    </Column>
  )
}
