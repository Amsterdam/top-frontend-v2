import { Paragraph } from "@amsterdam/design-system-react"
import { CertificateIcon } from "@amsterdam/design-system-react-icons"

import { usePermits } from "@/api/hooks"
import { Card, CardTableSkeleton, Description, Table } from "@/components"
import { isAcceptanceOrLocalEnvironment } from "@/config/isAcceptanceOrLocalEnvironment"
import { createPermitDescriptionData } from "./data/createPermitDescriptionData"
import dummyPowerBrowserResponse from "./data/dummyPowerBrowserResponse"
import { isValidPermit, sortPermits } from "./data/utils"
import { PermitBadge } from "./components/PermitBadge"
import { PermitValidityLabel } from "./components/PermitValidityLabel"

type Props = {
  bagId?: string
  loading?: boolean
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
      <PermitBadge status={permit.status ?? ""} />
    ),
  },
] as const

export default function PermitsCard({ bagId, loading = false }: Props) {
  const { data: permits, isPending } = usePermits(bagId)
  const isLoading = loading || isPending

  if (!bagId && !loading) return null

  const isDevOrAcc = isAcceptanceOrLocalEnvironment()
  // Show dummy data if we're in dev or acceptance environment, we have a valid address, we're not currently loading data, and we didn't get any residents back from the API
  const showDummyData = isDevOrAcc && !permits?.length
  const permitsToUse = showDummyData ? dummyPowerBrowserResponse : permits

  const sortedPermits = (permitsToUse ?? []).sort(sortPermits)

  return (
    <Card
      title={
        isLoading
          ? "Vergunningen PowerBrowser"
          : `Vergunningen PowerBrowser (${sortedPermits.length})`
      }
      icon={CertificateIcon}
      loading={isLoading}
      loadingLabel="Vergunningen PowerBrowser"
      loadingBody={<CardTableSkeleton rows={4} columns={2} />}
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
