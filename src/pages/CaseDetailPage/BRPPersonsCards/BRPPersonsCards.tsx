import { Grid, Paragraph } from "@amsterdam/design-system-react"
import { Card } from "@/components"
import { useResidents } from "@/api/hooks"
import BRPPersonCard from "./BRPPersonCard"
import { useFilteredResidents } from "./hooks/useFilteredResidents"

type Props = {
  data?: Case
}

export function BRPPersonsCards({ data }: Props) {
  const [residentsData, { isBusy, hasErrors }] = useResidents(
    data?.address?.bag_id,
  )

  const persons = residentsData?.personen || []
  const filteredResidents = useFilteredResidents(persons)

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
    <Grid gapVertical="large">
      {filteredResidents.map((resident, index) => (
        <Grid.Cell span="all" key={`person-${index}`}>
          <BRPPersonCard resident={resident} />
        </Grid.Cell>
      ))}
    </Grid>
  )
}

export default BRPPersonsCards
