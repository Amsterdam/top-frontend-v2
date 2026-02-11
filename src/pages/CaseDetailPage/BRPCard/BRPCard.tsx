import { Paragraph } from "@amsterdam/design-system-react"
import { PersonsIcon } from "@amsterdam/design-system-react-icons"
import { Card, HeadingWithIcon, Table } from "@/components"
import { useResidents } from "@/api/hooks"
import { filterDeceasedResidents } from "./utils/filterDeceasedResidents"
import type { Resident } from "./types"
import { PersonHeader } from "./components/PersonHeader/PersonHeader"
import { dummyResidentsResponse } from "./data/dummyResidentsResponse"
import { ResidentDetails } from "./components/ResidentDetails/ResidentDetails"
import { isAcceptanceOrLocalEnvironment } from "@/config/isAcceptanceOrLocalEnvironment"

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
  const [residentsData, { isBusy, hasErrors }] = useResidents(
    data?.address?.bag_id,
  )
  const isDevOrAcc = isAcceptanceOrLocalEnvironment()
  // Show dummy data if we're in dev or acceptance environment, we have a valid address, we're not currently loading data, and we didn't get any residents back from the API
  const showDummyData =
    isDevOrAcc && data && !isBusy && !residentsData?.personen?.length
  const residentsToUse = showDummyData ? dummyResidentsResponse : residentsData
  const persons = residentsToUse?.personen || []
  const filteredResidents = filterDeceasedResidents(persons)

  if (isBusy) {
    return (
      <Card>
        <Paragraph>Laden van BRP-gegevens...</Paragraph>
      </Card>
    )
  }
  if (hasErrors)
    return (
      <Card>
        <Paragraph>
          Er is iets misgegaan bij het ophalen van de BRP-gegevens. 😢
        </Paragraph>
      </Card>
    )
  if (!isBusy && residentsData && !filteredResidents.length) {
    return (
      <Card>
        <Paragraph>Geen ingeschreven personen gevonden.</Paragraph>
      </Card>
    )
  }

  return (
    <Card
      title={
        <HeadingWithIcon
          label={`Ingeschreven personen (${filteredResidents.length})`}
          svg={PersonsIcon}
          highlightIcon
        />
      }
      collapsible
      noContentPadding
      defaultOpen={false}
    >
      <Table
        columns={columns}
        data={filteredResidents}
        expandable={{
          expandedRow: (resident) => <ResidentDetails resident={resident} />,
        }}
      />
    </Card>
  )
}

export default BRPCard
