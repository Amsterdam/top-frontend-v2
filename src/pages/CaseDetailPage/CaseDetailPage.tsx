import {
  Column,
  Grid,
  Heading,
  Row,
  type GridCellProps,
} from "@amsterdam/design-system-react"
import { HouseIcon } from "@amsterdam/design-system-react-icons"
import { useNavigate, useParams } from "react-router"

import { Card, EllipsisActionMenu, StatusTag } from "@/components"
import { useCase } from "@/api/hooks"
import { formatAddress, getWorkflowName } from "@/shared"

import CaseInfoCard from "./CaseInfoCard/CaseInfoCard"
import HistoryCard from "./HistoryCard/HistoryCard"
import BAGCard from "./BAGCard/BAGCard"
import BRPCard from "./BRPCard/BRPCard"

const LARGE_GRID_CELL_SPAN: GridCellProps["span"] = {
  narrow: 4,
  medium: 8,
  wide: 8,
}

const SMALL_GRID_CELL_SPAN: GridCellProps["span"] = {
  narrow: 4,
  medium: 8,
  wide: 4,
}

export default function CaseDetailPage() {
  const { itineraryId, caseId } = useParams<{
    itineraryId: string
    caseId: string
  }>()
  const [data] = useCase(Number(caseId))
  const statusName = getWorkflowName(data?.workflows)
  const navigate = useNavigate()

  return (
    <Grid
      paddingBottom="x-large"
      gapVertical="large"
      style={{ columnGap: "var(--ams-space-l)" }}
    >
      <Grid.Cell span="all">
        <Row align="between">
          <Column>
            <Row wrap alignVertical="center">
              <Heading level={2}>{formatAddress(data?.address, true)}</Heading>
              <StatusTag statusName={statusName} />
            </Row>
          </Column>
          <Column>
            <EllipsisActionMenu
              actions={[
                {
                  label: "Bezoek",
                  onClick: () => navigate(`/bezoek/${itineraryId}/${caseId}`),
                  icon: HouseIcon,
                },
              ]}
            />
          </Column>
        </Row>
      </Grid.Cell>

      <Grid.Cell span={LARGE_GRID_CELL_SPAN}>
        <Grid paddingBottom="x-large" gapVertical="large">
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
            <Card title="Vergunningen">Vergunningen</Card>
          </Grid.Cell>
          <Grid.Cell span="all">
            <Card title="Vakantieverhuur">Vakantieverhuur</Card>
          </Grid.Cell>
        </Grid>
      </Grid.Cell>

      <Grid.Cell span={SMALL_GRID_CELL_SPAN}>
        <Grid paddingBottom="x-large" gapVertical="large">
          <Grid.Cell span="all">
            <Card title="Logboek">Logboek</Card>
          </Grid.Cell>
          <Grid.Cell span="all">
            <HistoryCard caseId={data?.id} />
          </Grid.Cell>
        </Grid>
      </Grid.Cell>
    </Grid>
  )
}
