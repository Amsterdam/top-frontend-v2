import { Badge, Icon, Paragraph, Row } from "@amsterdam/design-system-react"
import {
  CertificateIcon,
  ErrorIcon,
  SuccessIcon,
} from "@amsterdam/design-system-react-icons"

import { usePermitsDecos } from "@/api/hooks"
import { Card, Description, Table } from "@/components"
import { isAcceptanceOrLocalEnvironment } from "@/config/isAcceptanceOrLocalEnvironment"
import { createPermitDescriptionData } from "./data/createPermitDescriptionData"
import dummyDecosResponse from "./data/dummyDecosResponse"
import { filterKnownPermits, isDateValid } from "./data/utils"

type Props = {
  bagId?: string
}

function renderPermitStatus(permit: PermitDecos) {
  if (permit.permit_granted === "GRANTED") {
    return isDateValid(permit) ? (
      <Badge label="Verleend" color="lime" />
    ) : (
      <Badge label="Verlopen" color="red" />
    )
  }

  if (permit.permit_granted === "NOT_GRANTED") {
    return <Badge label="Niet verleend" color="yellow" />
  }

  return null
}

const columns = [
  {
    title: "Vergunning",
    dataIndex: "permit_type",
    render: (_: unknown, permit: PermitDecos) => {
      const isValid = permit.permit_granted === "GRANTED" && isDateValid(permit)

      return (
        <Row alignVertical="center" wrap>
          <Icon
            svg={isValid ? SuccessIcon : ErrorIcon}
            size="heading-3"
            style={{
              color: isValid
                ? "var(--ams-color-feedback-success)"
                : "var(--ams-color-feedback-error)",
            }}
          />
          <strong>{permit.permit_type || "-"}</strong>
        </Row>
      )
    },
  },
  {
    title: "Status",
    dataIndex: "permit_granted",
    render: (_: unknown, permit: PermitDecos) => renderPermitStatus(permit),
  },
] as const

export default function PermitsCardDecos({ bagId }: Props) {
  const { data: permitsDecos, isPending } = usePermitsDecos(bagId)

  if (!bagId || isPending) return null

  const isDevOrAcc = isAcceptanceOrLocalEnvironment()
  // Show dummy data if we're in dev or acceptance environment, we have a valid address, we're not currently loading data, and we didn't get any residents back from the API
  const showDummyData = isDevOrAcc && !permitsDecos?.length
  const permitsToUse = showDummyData ? dummyDecosResponse : permitsDecos
  const knownPermits = filterKnownPermits(permitsToUse) ?? []

  return (
    <Card
      title={`Vergunningen Decos (${knownPermits.length})`}
      icon={CertificateIcon}
    >
      {knownPermits.length === 0 ? (
        <Paragraph>Geen Decos vergunningen gevonden.</Paragraph>
      ) : (
        <Table
          columns={columns}
          data={knownPermits}
          expandable={{
            expandedRow: (permit) => (
              <Description
                termsWidth="narrow"
                data={createPermitDescriptionData(permit)}
              />
            ),
          }}
        />
      )}
    </Card>
  )
}
