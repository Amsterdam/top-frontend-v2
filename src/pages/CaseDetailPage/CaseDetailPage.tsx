import {
  ActionGroup,
  Button,
  Column,
  Grid,
  Heading,
  Row,
} from "@amsterdam/design-system-react"
import { HouseIcon } from "@amsterdam/design-system-react-icons"
import dayjs from "dayjs"
import { useNavigate, useParams } from "react-router"

import { useCase, useMeldingen, useRegistrations } from "@/api/hooks"
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

export default function CaseDetailPage() {
  const { itineraryId, caseId } = useParams<{
    itineraryId: string
    caseId: string
  }>()
  const [data, { isBusy }] = useCase(Number(caseId))
  const statusName = getWorkflowName(data?.workflows)
  const navigate = useNavigate()

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
    <Grid paddingVertical="large" gapVertical="large">
      <Grid.Cell span="all" appearance="transparent">
        <Row align="between" wrap>
          <Row wrap alignVertical="center">
            <Heading level={1}>{formatAddress(data?.address, true)}</Heading>
            <StatusTag statusName={statusName} />
          </Row>
          <ActionGroup>
            <Button
              variant="primary"
              onClick={() => navigate(`/bezoek/${itineraryId}/${caseId}`)}
              icon={HouseIcon}
            >
              Bezoek
            </Button>
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
  )
}
