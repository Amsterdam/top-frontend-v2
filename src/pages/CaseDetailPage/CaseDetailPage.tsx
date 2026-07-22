import {
  ActionGroup,
  Button,
  Column,
  Grid,
  Heading,
  Row,
} from "@amsterdam/design-system-react"
import {
  DeleteIcon,
  HouseIcon,
  PencilIcon,
} from "@amsterdam/design-system-react-icons"
import dayjs from "dayjs"
import { useNavigate, useParams } from "react-router"

import {
  useCase,
  useItinerary,
  useMeldingen,
  useRegistrations,
} from "@/api/hooks"
import { AmsterdamCrossSpinner, StatusTag } from "@/components"
import { isAcceptanceOrLocalEnvironment } from "@/config/isAcceptanceOrLocalEnvironment"
import { formatAddress, getWorkflowName } from "@/shared"

import CaseInfoCard from "./CaseInfoCard/CaseInfoCard"
import HistoryCard from "./HistoryCard/HistoryCard"
import BAGCard from "./BAGCard/BAGCard"
import BRPCard from "./BRPCard/BRPCard"
import LogbookCard from "./LogbookCard/LogbookCard"
import MeldingenCard from "./MeldingenCard/MeldingenCard"
import VakantieverhuurCard from "./VakantieverhuurCard/VakantieverhuurCard"
import PermitsCard from "./PermitsCard/PermitsCard"
import PermitsCardDecos from "./PermitsCardDecos/PermitsCardDecos"
import {
  getMostRecentVisit,
  getVisitState,
  VisitState,
} from "@/components/ItineraryListItem/visit"
import CompleteVisitButton from "@/pages/ListPage/components/CompleteVisitButton/CompleteVisitButton"
import { useDeleteItineraryItem } from "@/pages/ListPage/hooks/useDeleteItineraryItem"

export default function CaseDetailPage() {
  const { itineraryId, caseId } = useParams<{
    itineraryId: string
    caseId: string
  }>()
  const [data, { isBusy }] = useCase(Number(caseId))
  const [itinerary] = useItinerary(itineraryId)
  const statusName = getWorkflowName(data?.workflows)
  const navigate = useNavigate()

  const itineraryItem = itinerary?.items.find(
    (item) => item?.case.id === Number(caseId),
  )
  const { deleteItineraryItem, dialog } = useDeleteItineraryItem(
    itineraryItem?.id,
    {
      onSuccess: () => {
        if (itineraryId) {
          navigate(`/lijst/${itineraryId}`)
        }
      },
    },
  )
  const visitState = itineraryItem ? getVisitState(itineraryItem) : undefined
  const mostRecentVisit = itineraryItem
    ? getMostRecentVisit(itineraryItem)
    : null

  const bagId = data?.address?.bag_id
  const startDate = dayjs().subtract(1, "year").startOf("year").format()
  const [registrationsData, { isBusy: isBusyRegistrations }] =
    useRegistrations(bagId)
  const [meldingenData, { isBusy: isBusyMeldingen }] = useMeldingen(
    bagId,
    startDate,
  )

  const registrations = registrationsData || []
  const meldingen = (meldingenData?.data || []) as Melding[]
  const isBusyVakantieverhuur = isBusyRegistrations || isBusyMeldingen
  const showDummyVakantieverhuurData =
    Boolean(bagId) &&
    isAcceptanceOrLocalEnvironment() &&
    !isBusyVakantieverhuur &&
    !registrations.length &&
    !meldingen.length

  if (isBusy) {
    return <AmsterdamCrossSpinner />
  }
  return (
    <>
      {dialog}
      <Grid paddingVertical="large" gapVertical="large">
        <Grid.Cell span="all" appearance="transparent">
          <Row align="between" wrap>
            <Row wrap alignVertical="center">
              <Heading level={1}>{formatAddress(data?.address, true)}</Heading>
              <StatusTag statusName={statusName} />
            </Row>
            <ActionGroup>
              {visitState === VisitState.InProgress &&
                itineraryItem &&
                mostRecentVisit && (
                  <>
                    <Button
                      variant="secondary"
                      icon={DeleteIcon}
                      onClick={deleteItineraryItem}
                    >
                      Verwijderen
                    </Button>
                    <Button
                      variant="secondary"
                      icon={PencilIcon}
                      onClick={() =>
                        navigate(
                          `/bezoek/${itineraryId}/${itineraryItem.case?.id}/${mostRecentVisit.id}`,
                        )
                      }
                    >
                      Bewerken
                    </Button>
                    <CompleteVisitButton
                      visitId={mostRecentVisit.id}
                      itineraryItemId={itineraryItem.id}
                    />
                  </>
                )}
              {visitState === VisitState.Pending && itineraryItem && (
                <>
                  <Button
                    variant="secondary"
                    icon={DeleteIcon}
                    onClick={deleteItineraryItem}
                  >
                    Verwijderen
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => navigate(`/bezoek/${itineraryId}/${caseId}`)}
                    icon={HouseIcon}
                  >
                    Bezoek
                  </Button>
                </>
              )}
            </ActionGroup>
          </Row>
        </Grid.Cell>

        <Grid.Cell
          span={{ narrow: 4, medium: 8, wide: 8 }}
          appearance="transparent"
        >
          <Column gap="large">
            <CaseInfoCard data={data} />
            <BAGCard data={data} />
            <BRPCard data={data} />
            <PermitsCard bagId={bagId} />
            <PermitsCardDecos bagId={bagId} />
            <VakantieverhuurCard
              registrations={registrations}
              showDummyData={showDummyVakantieverhuurData}
            />
            <MeldingenCard
              meldingen={meldingen}
              startDate={startDate}
              showDummyData={showDummyVakantieverhuurData}
            />
          </Column>
        </Grid.Cell>

        <Grid.Cell span={{ narrow: 4, medium: 8, wide: 4 }}>
          <LogbookCard caseId={data?.id} />
          <HistoryCard caseId={data?.id} />
        </Grid.Cell>
      </Grid>
    </>
  )
}
