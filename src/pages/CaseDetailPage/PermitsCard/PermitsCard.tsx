import { Icon, Paragraph, Row } from "@amsterdam/design-system-react"
import {
  CertificateIcon,
  ErrorIcon,
  SuccessIcon,
} from "@amsterdam/design-system-react-icons"

import { usePermits } from "@/api/hooks"
import { Card, Description, Table } from "@/components"
import { isAcceptanceOrLocalEnvironment } from "@/config/isAcceptanceOrLocalEnvironment"
import { createPermitDescriptionData } from "./data/createPermitDescriptionData"
import dummyPowerBrowserResponse from "./data/dummyPowerBrowserResponse"
import { isValidPermit, sortPermits } from "./data/utils"
import { PermitTag } from "./components/PermitTag"

type Props = {
  bagId?: string
}

const columns = [
  {
    title: "Vergunning",
    dataIndex: "product",
    render: (_: unknown, permit: Permit) => {
      const isValid = isValidPermit(permit)

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
          <strong>{permit.product || "-"}</strong>
        </Row>
      )
    },
  },
  {
    title: "Status",
    dataIndex: "status",
    render: (_: unknown, permit: Permit) => (
      <PermitTag status={permit.status ?? ""} />
    ),
  },
] as const

export default function PermitsCard({ bagId }: Props) {
  const [permits, { isBusy }] = usePermits(bagId)

  if (!bagId || isBusy) return null

  const isDevOrAcc = isAcceptanceOrLocalEnvironment()
  // Show dummy data if we're in dev or acceptance environment, we have a valid address, we're not currently loading data, and we didn't get any residents back from the API
  const showDummyData = isDevOrAcc && !permits?.length
  const permitsToUse = showDummyData ? dummyPowerBrowserResponse : permits

  const sortedPermits = (permitsToUse ?? []).sort(sortPermits)

  return (
    <Card
      title={`Vergunningen PowerBrowser (${sortedPermits.length})`}
      icon={CertificateIcon}
    >
      {sortedPermits.length === 0 ? (
        <Paragraph>Geen vergunningen gevonden.</Paragraph>
      ) : (
        <Table
          columns={columns}
          data={sortedPermits}
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
