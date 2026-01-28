import { useNavigate, useParams } from "react-router"
import { Column, Button, Row } from "@amsterdam/design-system-react"
import { DeleteIcon, PencilIcon } from "@amsterdam/design-system-react-icons"
import { EllipsisActionMenu } from "@/components/EllipsisActionMenu/EllipsisActionMenu"
import { CompleteVisitButton } from "@/pages/ListPage/components/CompleteVisitButton/CompleteVisitButton"
import { useDeleteItineraryItem } from "@/pages/ListPage/hooks/useDeleteItineraryItem"
import { getMostRecentVisit, getVisitState, VisitState } from "../visit"

type Props = {
  item: ItineraryItem
}

export function DefaultVariant({ item }: Props) {
  const { itineraryId } = useParams<{ itineraryId: string }>()
  const { deleteItineraryItem, dialog } = useDeleteItineraryItem(item.id)
  const navigate = useNavigate()

  const caseData = item.case
  const visitState = getVisitState(item)
  const mostRecentVisit = getMostRecentVisit(item)

  return (
    <Column alignHorizontal="end">
      {dialog}
      {visitState === VisitState.Pending && (
        <>
          <Button
            onClick={() => navigate(`/bezoek/${itineraryId}/${caseData?.id}`)}
          >
            Bezoek
          </Button>
          <EllipsisActionMenu
            actions={[
              {
                label: "Verwijderen",
                onClick: deleteItineraryItem,
                icon: DeleteIcon,
              },
            ]}
          />
        </>
      )}
      {visitState === VisitState.InProgress && (
        <>
          <CompleteVisitButton
            visitId={mostRecentVisit?.id}
            itineraryItemId={item.id}
          />
          <Row>
            <EllipsisActionMenu
              actions={[
                {
                  label: "Bewerken",
                  onClick: () =>
                    navigate(
                      `/bezoek/${itineraryId}/${caseData?.id}/${mostRecentVisit?.id}`,
                    ),
                  icon: PencilIcon,
                },
                {
                  label: "Verwijderen",
                  onClick: deleteItineraryItem,
                  icon: DeleteIcon,
                },
              ]}
            />
          </Row>
        </>
      )}
    </Column>
  )
}
