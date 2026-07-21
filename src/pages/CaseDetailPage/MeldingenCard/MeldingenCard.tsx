import { Badge, Paragraph, Row } from "@amsterdam/design-system-react"
import {
  DeleteIcon,
  NotificationIcon,
  PencilIcon,
} from "@amsterdam/design-system-react-icons"

import { Card, Description, Table, Tag } from "@/components"
import { formatDate } from "@/shared/dateFormatters"

import { dummyMeldingenResponse } from "./data/dummyMeldingenResponse"

type Props = {
  meldingen?: Melding[]
  startDate: string
  showDummyData?: boolean
}

function formatMeldingPeriod(melding: Melding) {
  return `${formatDate(melding.startDatum, "D MMM", "-")} - ${formatDate(melding.eindDatum, "D MMM", "-")}`
}

function renderMeldingStatus(melding: Melding) {
  if (!melding.isAangepast && !melding.isVerwijderd) {
    return "-"
  }

  return (
    <Row wrap>
      {melding.isAangepast && (
        <Badge label="Aangepast" color="orange" icon={PencilIcon} />
      )}
      {melding.isVerwijderd && (
        <Badge label="Verwijderd" color="red" icon={DeleteIcon} />
      )}
    </Row>
  )
}

function createMeldingDescriptionData(melding: Melding) {
  return [
    {
      label: "Periode",
      value: formatMeldingPeriod(melding),
    },
    {
      label: "Nachten",
      value: melding.nachten,
    },
    {
      label: "Gasten",
      value: melding.gasten,
    },
    {
      label: "Status",
      value: renderMeldingStatus(melding),
    },
    {
      label: "Gemaakt op",
      value: formatDate(melding.gemaaktOp, "DD MMM, HH:mm", "-"),
    },
  ]
}

const columns = [
  {
    title: "Periode",
    dataIndex: "startDatum",
    render: (_: unknown, melding: Melding) => (
      <strong>{formatMeldingPeriod(melding)}</strong>
    ),
  },
  // {
  //   title: "Nachten",
  //   dataIndex: "nachten",
  // },
  {
    title: "Gasten",
    dataIndex: "gasten",
  },
  {
    title: "Status",
    dataIndex: "status",
    render: (_: unknown, melding: Melding) => renderMeldingStatus(melding),
  },
] as const

export default function MeldingenCard({
  meldingen,
  startDate,
  showDummyData = false,
}: Props) {
  const meldingenToUse = showDummyData
    ? dummyMeldingenResponse
    : (meldingen ?? [])

  const totalNights = meldingenToUse.reduce(
    (total, { nachten }) => total + nachten,
    0,
  )

  return (
    <Card
      title={`Meldingen (${meldingenToUse.length})`}
      icon={NotificationIcon}
    >
      {meldingenToUse.length > 0 && (
        <div className="mb-2">
          <Paragraph size="small">
            {totalNights} nachten sinds {formatDate(startDate, "D MMM YYYY")}
          </Paragraph>
        </div>
      )}
      {meldingenToUse.length === 0 ? (
        <Paragraph>Geen meldingen gevonden.</Paragraph>
      ) : (
        <Table
          columns={columns}
          data={meldingenToUse}
          expandable={{
            expandedRow: (melding) => (
              <Description
                termsWidth="narrow"
                data={createMeldingDescriptionData(melding)}
              />
            ),
          }}
        />
      )}
    </Card>
  )
}
