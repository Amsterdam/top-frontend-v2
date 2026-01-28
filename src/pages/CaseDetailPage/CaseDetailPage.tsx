import { useCase } from "@/api/hooks"
import {
  Grid,
  Heading,
  Row,
  type GridCellProps,
} from "@amsterdam/design-system-react"
import { useParams } from "react-router"
import { Card, StatusTag } from "@/components"

import { formatAddress } from "@/shared/formatAddress"
import { getWorkflowName } from "@/shared"
import CaseInfoCard from "./CaseInfoCard/CaseInfoCard"
import ResidenceCard from "./ResidenceCard/ResidenceCard"

const DEFAULT_GRID_CELL_SPAN: GridCellProps["span"] = {
  narrow: 4,
  medium: 4,
  wide: 4,
}

export default function CaseDetailPage() {
  const { caseId } = useParams<{ caseId: string }>()
  const [data] = useCase(caseId)
  console.log("Data:", data)
  const statusName = getWorkflowName(data?.workflows)
  return (
    <div>
      <Grid paddingBottom="x-large">
        <Grid.Cell span="all">
          <Card>
            <Row alignVertical="center" gap="large">
              <Heading level={2}>{formatAddress(data?.address)}</Heading>
              <StatusTag statusName={statusName} />
              {/* <Paragraph style={{ fontSize: "var(--ams-heading-3-font-size)" }}>
                - {statusName}
              </Paragraph> */}
            </Row>
          </Card>
        </Grid.Cell>
        <Grid.Cell span={DEFAULT_GRID_CELL_SPAN}>
          <CaseInfoCard data={data} />
        </Grid.Cell>
        <Grid.Cell span={DEFAULT_GRID_CELL_SPAN}>
          <ResidenceCard data={data} />
        </Grid.Cell>
        <Grid.Cell span={DEFAULT_GRID_CELL_SPAN}>
          <Card title="Ingeschreven personen">Ingeschreven personen</Card>
        </Grid.Cell>
        <Grid.Cell span={DEFAULT_GRID_CELL_SPAN}>
          <Card title="Vergunningen">Vergunningen</Card>
        </Grid.Cell>
        <Grid.Cell span={DEFAULT_GRID_CELL_SPAN}>
          <Card title="Vakantieverhuur">Vakantieverhuur</Card>
        </Grid.Cell>
        <Grid.Cell span={DEFAULT_GRID_CELL_SPAN}>
          <Card title="Zaakhistorie">Zaakhistorie</Card>
        </Grid.Cell>
        <Grid.Cell span={DEFAULT_GRID_CELL_SPAN}>
          <Card title="Logboek">Logboek</Card>
        </Grid.Cell>
      </Grid>
    </div>
  )
}
