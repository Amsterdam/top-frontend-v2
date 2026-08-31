import { Grid } from "@amsterdam/design-system-react"

import { NumberFieldGrid } from "../components/NumberFieldGrid"
import { StepActions } from "../components/StepActions"
import { BUITEN_PARKEREN_FIELDS, KLIMAAT_FIELDS } from "../fieldDefinitions"

type Props = {
  onNextStep: () => void
}

export function StepKlimaatBuitenParkeren({ onNextStep }: Props) {
  return (
    <Grid gapVertical="large" style={{ paddingInlineStart: 0 }}>
      <Grid.Cell span="all" appearance="transparent">
        <NumberFieldGrid
          fields={[...KLIMAAT_FIELDS, ...BUITEN_PARKEREN_FIELDS]}
        />
      </Grid.Cell>

      <Grid.Cell span="all" appearance="transparent">
        <StepActions onNextStep={onNextStep} />
      </Grid.Cell>
    </Grid>
  )
}

export default StepKlimaatBuitenParkeren
