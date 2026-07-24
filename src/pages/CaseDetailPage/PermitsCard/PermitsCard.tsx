import { Paragraph } from "@amsterdam/design-system-react"
import { CertificateIcon } from "@amsterdam/design-system-react-icons"

import { usePermits } from "@/api/hooks"
import { Card, Description, Table } from "@/components"
import { isAcceptanceOrLocalEnvironment } from "@/config/isAcceptanceOrLocalEnvironment"
import { createPermitDescriptionData } from "./data/createPermitDescriptionData"
import dummyPowerBrowserResponse from "./data/dummyPowerBrowserResponse"
import { isValidPermit, sortPermits } from "./data/utils"
import { PermitTag } from "./components/PermitTag"
import { PermitValidityLabel } from "./components/PermitValidityLabel"

type Props = {
  bagId?: string
}

const columns = [
  {
    title: "Vergunning",
    dataIndex: "product",
    render: (_: unknown, permit: Permit) => (
      <PermitValidityLabel
        label={permit.product}
        isValid={isValidPermit(permit)}
      />
    ),
  },
  {
    title: "Status",
    dataIndex: "status",
    hideOnMobile: true,
    render: (_: unknown, permit: Permit) => (
      <PermitTag status={permit.status ?? ""} />
    ),
  },
] as const

export default function PermitsCard({ bagId }: Props) {
  const { data: permits, isPending } = usePermits(bagId)

  if (!bagId || isPending) return null

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
