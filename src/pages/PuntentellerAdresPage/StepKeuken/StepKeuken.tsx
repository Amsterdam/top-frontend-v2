import { Grid } from "@amsterdam/design-system-react"
import { NumberFieldGrid } from "../components/NumberFieldGrid"
import { StepActions } from "../components/StepActions"
import { KEUKEN_FIELDS } from "../fieldDefinitions"

type Props = {
  onNextStep: () => void
}

export function StepKeuken({ onNextStep }: Props) {
  return (
    <Grid gapVertical="large" style={{ paddingInlineStart: 0 }}>
      <Grid.Cell span="all" appearance="transparent">
        <NumberFieldGrid fields={[...KEUKEN_FIELDS]} />
      </Grid.Cell>

      <Grid.Cell span="all" appearance="transparent">
        <StepActions onNextStep={onNextStep} />
      </Grid.Cell>
    </Grid>
  )
}

export default StepKeuken
