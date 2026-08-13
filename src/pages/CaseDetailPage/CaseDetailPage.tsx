import {
  ActionGroup,
  Button,
  Grid,
  Heading,
  Row,
  Skeleton,
} from "@amsterdam/design-system-react"
import {
  DeleteIcon,
  HouseIcon,
  PencilIcon,
} from "@amsterdam/design-system-react-icons"
import dayjs from "dayjs"
import { useQueryClient } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router"

import {
  useCase,
  useItinerary,
  useMeldingen,
  useRegistrations,
} from "@/api/hooks"
import { queryKeys } from "@/api/queryKeys"
import { StatusBadge } from "@/components"
import { AddToItineraryVariant } from "@/components/ItineraryListItem/variants"
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
  const { itineraryId: itineraryIdFromParams, caseId } = useParams<{
    itineraryId?: string
    caseId: string
  }>()
  const queryClient = useQueryClient()
  const cachedItineraryId = queryClient
    .getQueriesData<Itinerary>({ queryKey: queryKeys.itineraries.all })
    .find(
      ([queryKey, itinerary]) =>
        queryKey.length === 2 &&
        queryKey[0] === queryKeys.itineraries.all[0] &&
        queryKey[1] !== "summary" &&
        itinerary?.items.some((item) => item?.case.id === Number(caseId)),
    )?.[1]
    ?.id?.toString()
  const itineraryId = itineraryIdFromParams ?? cachedItineraryId
  const { data, isPending } = useCase(Number(caseId))
  const { data: itinerary } = useItinerary(itineraryId)
  const statusName = getWorkflowName(data?.workflows)
  const navigate = useNavigate()

  const itineraryItem = itinerary?.items.find(
    (item) => item?.case.id === Number(caseId),
  )
  const { deleteItineraryItem, dialog } = useDeleteItineraryItem(
    itineraryItem?.id,
    {
      itineraryId,
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
  const {
    data: registrationsData,
    isPending: isBusyRegistrations,
    isError: isErrorRegistrations,
  } = useRegistrations(bagId)
  const {
    data: meldingenData,
    isPending: isBusyMeldingen,
    isError: isErrorMeldingen,
  } = useMeldingen(bagId, startDate)

  const registrations = registrationsData || []
  const meldingen = (meldingenData?.data || []) as Melding[]
  const isBusyVakantieverhuur = isBusyRegistrations || isBusyMeldingen
  const showDummyVakantieverhuurData =
    Boolean(bagId) &&
    isAcceptanceOrLocalEnvironment() &&
    !isBusyVakantieverhuur &&
    !registrations.length &&
    !meldingen.length

  if (isPending) {
    return (
      <>
        {dialog}
        <Grid paddingVertical="large" gapVertical="large">
          <Grid.Cell span="all" appearance="transparent">
            <Row align="between" wrap>
              <Row wrap alignVertical="center">
                <Skeleton>
                  <Skeleton.Heading lines={1} />
                </Skeleton>
              </Row>
            </Row>
          </Grid.Cell>

          <Grid.Subgrid span={{ narrow: 4, medium: 8, wide: 8 }}>
            <Grid.Cell span="all">
              <CaseInfoCard loading />
            </Grid.Cell>
            <Grid.Cell span="all">
              <BAGCard data={undefined} loading />
            </Grid.Cell>
            <Grid.Cell span="all">
              <BRPCard loading />
            </Grid.Cell>
            <Grid.Cell span="all">
              <PermitsCard loading />
            </Grid.Cell>
            <Grid.Cell span="all">
              <PermitsCardDecos loading />
            </Grid.Cell>
            <Grid.Cell span="all">
              <VakantieverhuurCard loading />
            </Grid.Cell>
            <Grid.Cell span="all">
              <MeldingenCard startDate={startDate} loading />
            </Grid.Cell>
          </Grid.Subgrid>

          <Grid.Subgrid span={{ narrow: 4, medium: 8, wide: 4 }}>
            <Grid.Cell span="all">
              <LogbookCard loading />
            </Grid.Cell>
            <Grid.Cell span="all">
              <HistoryCard loading />
            </Grid.Cell>
          </Grid.Subgrid>
        </Grid>
      </>
    )
  }

  if (!data) {
    return null
  }

  return (
    <>
      {dialog}
      <Grid paddingVertical="large" gapVertical="large">
        <Grid.Cell span="all" appearance="transparent">
          <Row align="between" wrap>
            <Row wrap alignVertical="center">
              <Heading level={1}>{formatAddress(data?.address, true)}</Heading>
              <StatusBadge statusName={statusName} />
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
              {!itineraryItem && <AddToItineraryVariant caseData={data} />}
            </ActionGroup>
          </Row>
        </Grid.Cell>

        <Grid.Subgrid span={{ narrow: 4, medium: 8, wide: 8 }}>
          <Grid.Cell span="all">
            <CaseInfoCard data={data} />
          </Grid.Cell>
          <Grid.Cell span="all">
            <BAGCard data={data} />
          </Grid.Cell>
          <Grid.Cell span="all">
            <BRPCard data={data} />
          </Grid.Cell>
          <Grid.Cell span="all">
            <PermitsCard bagId={bagId} />
          </Grid.Cell>
          <Grid.Cell span="all">
            <PermitsCardDecos bagId={bagId} />
          </Grid.Cell>
          <Grid.Cell span="all">
            <VakantieverhuurCard
              registrations={registrations}
              showDummyData={showDummyVakantieverhuurData}
              loading={isBusyRegistrations}
              isError={isErrorRegistrations}
            />
          </Grid.Cell>
          <Grid.Cell span="all">
            <MeldingenCard
              meldingen={meldingen}
              startDate={startDate}
              showDummyData={showDummyVakantieverhuurData}
              loading={isBusyMeldingen}
              isError={isErrorMeldingen}
            />
          </Grid.Cell>
        </Grid.Subgrid>

        <Grid.Subgrid span={{ narrow: 4, medium: 8, wide: 4 }}>
          <Grid.Cell span="all">
            <LogbookCard caseId={data?.id} />
          </Grid.Cell>
          <Grid.Cell span="all">
            <HistoryCard caseId={data?.id} />
          </Grid.Cell>
        </Grid.Subgrid>
      </Grid>
    </>
  )
}
