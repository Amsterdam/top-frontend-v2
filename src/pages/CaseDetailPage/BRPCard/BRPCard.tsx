import { Paragraph } from "@amsterdam/design-system-react"
import { PersonsIcon } from "@amsterdam/design-system-react-icons"
import { Card, Table } from "@/components"
import { useResidents } from "@/api/hooks"
import type { Resident } from "./types"
import { PersonHeader } from "./components/PersonHeader/PersonHeader"
import { dummyResidentsResponse } from "./data/dummyResidentsResponse"
import { ResidentDetails } from "./components/ResidentDetails/ResidentDetails"
import { isAcceptanceOrLocalEnvironment } from "@/config/isAcceptanceOrLocalEnvironment"
import { getVisibleResidentsSortedByAge } from "./utils/getVisibleResidentsSortedByAge"

type Props = {
  data?: Case
}

const columns = [
  {
    title: "Naam",
    dataIndex: "name",
    render: (_: unknown, resident: Resident) => (
      <PersonHeader resident={resident} />
    ),
  },
  { title: "Leeftijd", dataIndex: "leeftijd" },
] as const

export function BRPCard({ data }: Props) {
  const {
    data: residentsData,
    isPending,
    isError,
  } = useResidents(data?.address?.bag_id)
  const isDevOrAcc = isAcceptanceOrLocalEnvironment()
  // Show dummy data if we're in dev or acceptance environment, we have a valid address, we're not currently loading data, and we didn't get any residents back from the API
  const showDummyData =
    isDevOrAcc && data && !isPending && !residentsData?.personen?.length
  const residentsToUse = showDummyData ? dummyResidentsResponse : residentsData
  const persons = residentsToUse?.personen || []

  const sortedResidents = getVisibleResidentsSortedByAge(persons)

  if (!data || isPending) return null

  return (
    <Card
      title={`Ingeschreven personen (${sortedResidents.length})`}
      icon={PersonsIcon}
    >
      {isError && (
        <Paragraph>
          Er is iets misgegaan bij het ophalen van de BRP-gegevens. 😢
        </Paragraph>
      )}
      {!isError && !sortedResidents.length && (
        <Paragraph>Geen ingeschreven personen gevonden.</Paragraph>
      )}
      {!isError && sortedResidents.length > 0 && (
        <Table
          columns={columns}
          data={sortedResidents}
          expandable={{
            expandedRow: (resident) => <ResidentDetails resident={resident} />,
          }}
        />
      )}
    </Card>
  )
}

export default BRPCard
