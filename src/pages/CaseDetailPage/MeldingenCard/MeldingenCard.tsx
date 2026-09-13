import { Paragraph, Row } from "@amsterdam/design-system-react"
import { useMemo } from "react"
import {
  DeleteIcon,
  NotificationIcon,
  PencilIcon,
} from "@amsterdam/design-system-react-icons"

import { Card, CardTableSkeleton, Description, Table } from "@/components"
import { renderStatusBadge } from "@/shared"
import { formatDate } from "@/shared/dateFormatters"

import { dummyMeldingenResponse } from "./data/dummyMeldingenResponse"
import dayjs from "dayjs"

type Props = {
  meldingen?: Melding[]
  startDate: string
  showDummyData?: boolean
  loading?: boolean
  isError?: boolean
}

function formatMeldingPeriod(melding: Melding) {
  /*
  Format the period of a melding, taking into account different years for start and end dates.
  */
  const currentYear = dayjs().year()
  const startYear = dayjs(melding.startDatum).year()
  const endYear = dayjs(melding.eindDatum).year()

  const startFormat = startYear !== endYear ? "D MMM [']YY" : "D MMM"
  const endFormat = endYear !== currentYear ? "D MMM [']YY" : "D MMM"

  return `${formatDate(melding.startDatum, startFormat, "-")} - ${formatDate(melding.eindDatum, endFormat, "-")}`
}

function renderMeldingStatus(melding: Melding) {
  if (!melding.isAangepast && !melding.isVerwijderd) {
    return "-"
  }

  return (
    <Row wrap>
      {melding.isAangepast &&
        renderStatusBadge("Aangepast", {
          variant: "warning",
          icon: PencilIcon,
        })}
      {melding.isVerwijderd &&
        renderStatusBadge("Verwijderd", {
          variant: "error",
          icon: DeleteIcon,
        })}
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
      value: formatDate(melding.gemaaktOp, "DD MMM YYYY, HH:mm", "-"),
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
  {
    title: "Gasten",
    dataIndex: "gasten",
  },
  {
    title: "Status",
    dataIndex: "status",
    render: (_: unknown, melding: Melding) => renderMeldingStatus(melding),
    hideOnMobile: true,
  },
] as const

export default function MeldingenCard({
  meldingen = [],
  startDate,
  showDummyData = false,
  loading = false,
  isError = false,
}: Props) {
  const meldingenSource = showDummyData ? dummyMeldingenResponse : meldingen

  const meldingenToUse = useMemo(
    () =>
      [...meldingenSource].sort((a, b) =>
        dayjs(b.eindDatum).diff(dayjs(a.eindDatum)),
      ),
    [meldingenSource],
  )

  const totalNights = meldingenToUse.reduce(
    (total, { nachten }) => total + nachten,
    0,
  )

  return (
    <Card
      title={loading ? "Meldingen" : `Meldingen (${meldingenToUse.length})`}
      icon={NotificationIcon}
      loading={loading}
      loadingLabel="Meldingen"
      loadingBody={<CardTableSkeleton rows={4} columns={3} />}
      error={isError ? "Meldingen konden niet worden opgehaald." : undefined}
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
