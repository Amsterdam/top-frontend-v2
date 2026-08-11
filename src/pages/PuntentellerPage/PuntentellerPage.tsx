import { Grid, Heading } from "@amsterdam/design-system-react"
import { useNavigate } from "react-router"
import StepAddressSearch from "./StepAddressSearch/StepAddressSearch"

export default function PuntentellerPage() {
  const navigate = useNavigate()

  return (
    <Grid paddingBottom="x-large" paddingTop="large">
      <Grid.Cell span="all" appearance="transparent">
        <Heading level={1}>Puntenteller</Heading>
      </Grid.Cell>
      <Grid.Cell span="all">
        <StepAddressSearch
          onSelectAddress={(address) =>
            navigate(`/puntenteller/${address.adresseerbaarobject_id}`)
          }
        />
      </Grid.Cell>
    </Grid>
  )
}
