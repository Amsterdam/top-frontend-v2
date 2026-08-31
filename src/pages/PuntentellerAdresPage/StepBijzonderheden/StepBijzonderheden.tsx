import { Grid } from "@amsterdam/design-system-react"
import { CheckboxControl, TextInputControl } from "@amsterdam/ee-ads-rhf"
import { NumberFieldGrid } from "../components/NumberFieldGrid"
import { StepActions } from "../components/StepActions"
import { BIJZONDERE_VOORZIENING_FIELDS } from "../fieldDefinitions"

type Props = {
  onNextStep: () => void
}

export function StepBijzonderheden({ onNextStep }: Props) {
  return (
    <Grid gapVertical="large" style={{ paddingInlineStart: 0 }}>
      <Grid.Cell
        span={{ narrow: 4, medium: 4, wide: 6 }}
        appearance="transparent"
      >
        <CheckboxControl<GebruikersinvoerFormValues>
          label="Is deze woning een rijks- of gemeentelijk monument?"
          name="monument"
        />
      </Grid.Cell>
      <Grid.Cell
        span={{ narrow: 4, medium: 4, wide: 6 }}
        appearance="transparent"
      >
        <TextInputControl<GebruikersinvoerFormValues>
          label="Soort monument"
          name="monument_soort"
          shouldShow={(watch) => watch("monument") === true}
        />
      </Grid.Cell>

      <Grid.Cell span="all" appearance="transparent">
        <NumberFieldGrid fields={[...BIJZONDERE_VOORZIENING_FIELDS]} />
      </Grid.Cell>
      <Grid.Cell span="all" appearance="transparent">
        <StepActions onNextStep={onNextStep} />
      </Grid.Cell>
    </Grid>
  )
}

export default StepBijzonderheden
