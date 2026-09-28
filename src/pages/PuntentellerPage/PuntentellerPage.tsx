import { Grid, Heading } from "@amsterdam/design-system-react"
import { useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router"
import { queryKeys } from "@/api/queryKeys"
import StepAddressSearch from "./StepAddressSearch/StepAddressSearch"

export default function PuntentellerPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return (
    <Grid paddingBottom="x-large" paddingTop="large" gapVertical="large">
      <Grid.Cell span="all" appearance="transparent">
        <Heading level={1}>Puntenteller</Heading>
      </Grid.Cell>
      <Grid.Cell span="all">
        <StepAddressSearch
          onSelectAddress={(address) => {
            // The address page shows this address (useBagPdokAddress) without fetching it again.
            queryClient.setQueryData(
              queryKeys.pdok.address(address.adresseerbaarobject_id),
              address,
            )
            navigate(`/puntenteller/${address.adresseerbaarobject_id}`)
          }}
        />
      </Grid.Cell>
    </Grid>
  )
}
