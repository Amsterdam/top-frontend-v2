import { Grid, Heading, Paragraph } from "@amsterdam/design-system-react"
import { StepActions } from "../components/StepActions"

type Props = {
  onNextStep: () => void
}

export function StepBijzonderheden({ onNextStep }: Props) {
  return (
    <Grid gapVertical="large" style={{ paddingInlineStart: 0 }}>
      <Grid.Cell span="all" appearance="transparent">
        <Heading level={2}>Bijzonderheden</Heading>
        <Paragraph>Deze stap volgt nog.</Paragraph>
      </Grid.Cell>

      <Grid.Cell span="all" appearance="transparent">
        <StepActions onNextStep={onNextStep} />
      </Grid.Cell>
    </Grid>
  )
}

export default StepBijzonderheden
