import { Grid } from "@amsterdam/design-system-react"
import { NumberFieldGrid } from "../components/NumberFieldGrid"
import { StepActions } from "../components/StepActions"
import { APART_TOILET_FIELDS, BADKAMER_FIELDS } from "../fieldDefinitions"

type Props = {
  onNextStep: () => void
}

export function StepSanitair({ onNextStep }: Props) {
  return (
    <Grid gapVertical="large" style={{ paddingInlineStart: 0 }}>
      <Grid.Cell span="all" appearance="transparent">
        <NumberFieldGrid
          fields={[...BADKAMER_FIELDS, ...APART_TOILET_FIELDS]}
        />
      </Grid.Cell>

      <Grid.Cell span="all" appearance="transparent">
        <StepActions onNextStep={onNextStep} />
      </Grid.Cell>
    </Grid>
  )
}

export default StepSanitair
