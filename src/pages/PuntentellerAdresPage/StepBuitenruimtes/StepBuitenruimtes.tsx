import { useState } from "react"
import {
  Column,
  Grid,
  Heading,
  Paragraph,
} from "@amsterdam/design-system-react"
import { RuimteTypeButtons } from "../components/RuimteTypeButtons"
import { StepActions } from "../components/StepActions"

const BUITENRUIMTE_TYPES: BuitenruimteType[] = [
  "Balkon",
  "Dakterras",
  "Voortuin / zijtuin",
  "Achtertuin",
  "Loggia",
]

type Props = {
  onNextStep: () => void
}

export function StepBuitenruimtes({ onNextStep }: Props) {
  // The buitenruimte type currently chosen; its questions aren't defined yet, so nothing is
  // stored in the form so far.
  const [openType, setOpenType] = useState<BuitenruimteType>()

  return (
    <>
      <Grid.Cell span="all">
        <Column gap="large">
          <Heading level={2}>Buitenruimtes</Heading>

          <Column gap="small">
            <Heading level={3}>Kies een buitenruimte</Heading>
            <Paragraph className="ams-mb-m">
              Welke buitenruimtes zijn er voor eigen gebruik? Vul ze één voor
              één in.
            </Paragraph>
            <RuimteTypeButtons
              types={BUITENRUIMTE_TYPES}
              openType={openType}
              onAdd={setOpenType}
            />
          </Column>
        </Column>
      </Grid.Cell>

      {openType && (
        <Grid.Cell span="all">
          <Heading level={2} className="ams-mb-m">
            {openType}
          </Heading>
          <Paragraph>De vragen voor deze buitenruimte volgen nog.</Paragraph>
        </Grid.Cell>
      )}

      <Grid.Cell span="all" appearance="transparent">
        <StepActions onNextStep={onNextStep} />
      </Grid.Cell>
    </>
  )
}

export default StepBuitenruimtes
