import { useCase } from "@/api/hooks"
import {
  Breadcrumb,
  Button,
  Grid,
  Heading,
  Row,
  type GridCellProps,
} from "@amsterdam/design-system-react"
import { useNavigate, useParams } from "react-router"
import { Card, Flex, StatusTag } from "@/components"

import { formatAddress } from "@/shared/formatAddress"
import { getWorkflowName } from "@/shared"
import CaseInfoCard from "./CaseInfoCard/CaseInfoCard"
import HistoryCard from "./HistoryCard/HistoryCard"
import BRPPersonsCards from "./BRPPersonsCards/BRPPersonsCards"
import BAGCard from "./BAGCard/BAGCard"
import BRPCopy from "./BRPPersonsCards-copy/BRPPersonsCards"

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
  console.log("Data:", data)
  return (
    <Grid
      paddingBottom="x-large"
      gapVertical="large"
      style={{ columnGap: "var(--ams-space-l)" }}
    >
      <Grid.Cell span="all">
        <Breadcrumb>
          <Breadcrumb.Link href="#">Home</Breadcrumb.Link>
          <Breadcrumb.Link href="#">Lijst</Breadcrumb.Link>
          <Breadcrumb.Link href="#">Zaak 5967</Breadcrumb.Link>
        </Breadcrumb>
      </Grid.Cell>
      <Grid.Cell span="all">
        <Row alignVertical="center" gap="large" wrap align="between">
          <Flex direction="row">
            <Heading level={2}>{formatAddress(data?.address, true)}</Heading>
            <StatusTag statusName={statusName} />
          </Flex>
          <Button
            variant="secondary"
            onClick={() => navigate(`/bezoek/${itineraryId}/${caseId}`)}
          >
            Bezoek
          </Button>
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
            <BRPCopy data={data} />
          </Grid.Cell>
          <Grid.Cell span="all">
            <BRPPersonsCards data={data} />
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
