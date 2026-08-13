import { Paragraph } from "@amsterdam/design-system-react"
import { CertificateIcon } from "@amsterdam/design-system-react-icons"

import { usePermitsDecos } from "@/api/hooks"
import { Card, CardTableSkeleton, Description, Table } from "@/components"
import { isAcceptanceOrLocalEnvironment } from "@/config/isAcceptanceOrLocalEnvironment"
import { renderStatusBadge } from "@/shared"
import { createPermitDescriptionData } from "./data/createPermitDescriptionData"
import dummyDecosResponse from "./data/dummyDecosResponse"
import { filterKnownPermits, isDateValid } from "./data/utils"
import { PermitValidityLabel } from "../PermitsCard/components/PermitValidityLabel"

type Props = {
  bagId?: string
  loading?: boolean
}

function renderPermitStatus(permit: PermitDecos) {
  if (permit.permit_granted === "GRANTED") {
    return isDateValid(permit)
      ? renderStatusBadge("Verleend", { variant: "success" })
      : renderStatusBadge("Verlopen", { variant: "error" })
  }

  if (permit.permit_granted === "NOT_GRANTED") {
    return renderStatusBadge("Niet verleend", { variant: "warning" })
  }

  return null
}

const columns = [
  {
    title: "Vergunning",
    dataIndex: "permit_type",
    render: (_: unknown, permit: PermitDecos) => (
      <PermitValidityLabel
        label={permit.permit_type}
        isValid={permit.permit_granted === "GRANTED" && isDateValid(permit)}
      />
    ),
  },
  {
    title: "Status",
    dataIndex: "permit_granted",
    hideOnMobile: true,
    render: (_: unknown, permit: PermitDecos) => renderPermitStatus(permit),
  },
] as const

export default function PermitsCardDecos({ bagId, loading = false }: Props) {
  const { data: permitsDecos, isPending, isError } = usePermitsDecos(bagId)
  const isLoading = loading || isPending

  if (!bagId && !loading) return null

  const isDevOrAcc = isAcceptanceOrLocalEnvironment()
  // Show dummy data if we're in dev or acceptance environment, we have a valid address, we're not currently loading data, and we didn't get any residents back from the API
  const showDummyData = isDevOrAcc && !permitsDecos?.length
  const permitsToUse = showDummyData ? dummyDecosResponse : permitsDecos
  const knownPermits = filterKnownPermits(permitsToUse) ?? []

  return (
    <Card
      title={
        isLoading
          ? "Vergunningen Decos"
          : `Vergunningen Decos (${knownPermits.length})`
      }
      icon={CertificateIcon}
      loading={isLoading}
      loadingLabel="Vergunningen Decos"
      loadingBody={<CardTableSkeleton rows={4} columns={2} />}
      error={isError ? "Vergunningen konden niet worden opgehaald." : undefined}
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
