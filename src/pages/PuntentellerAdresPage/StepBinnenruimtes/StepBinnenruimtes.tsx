import { Grid, Heading, Paragraph } from "@amsterdam/design-system-react"
import { RadioControl } from "@amsterdam/ee-ads-rhf"
import { StepActions } from "../components/StepActions"

type Props = {
  onNextStep: () => void
}

export function StepBinnenruimtes({ onNextStep }: Props) {
  return (
    <>
      <Grid gapVertical="large" style={{ paddingInlineStart: 0 }}>
        <Grid.Cell span="all" appearance="transparent">
          <Heading level={2}>Binnenruimtes</Heading>
          <Paragraph>
            Uit welke binnenruimtes bestaat de woning? Vul de oppervlakte per
            ruimte in. Doe dit voor alle binnenruimtes in de woning. Alle
            ruimtes in de woning tellen mee in de puntentelling.
          </Paragraph>
        </Grid.Cell>

        <Grid.Cell span="all" appearance="flush">
          <RadioControl<GebruikersinvoerFormValues>
            label="Bevindt zich een bad, douche of wastafel buiten de badkamer?"
            description="Bijvoorbeeld een wastafel op de slaapkamer of een douche in een aparte ruimte."
            name="bad_douche_wastafel_andere_ruimte"
            options={[
              { label: "Nee", value: "false" },
              { label: "Ja", value: "true" },
            ]}
            registerOptions={{
              required: "Deze vraag is verplicht",
            }}
          />
        </Grid.Cell>

        <Grid.Cell span="all" appearance="flush">
          <RadioControl<GebruikersinvoerFormValues>
            label="Bevindt zich een keuken buiten de daarvoor bestemde ruimte?"
            description="Bijvoorbeeld een kookvoorziening die onderdeel is van de woonkamer."
            name="keuken_andere_ruimte"
            options={[
              { label: "Nee", value: "false" },
              { label: "Ja", value: "true" },
            ]}
            registerOptions={{
              required: "Deze vraag is verplicht",
            }}
          />
        </Grid.Cell>

        <Grid.Cell span="all" appearance="transparent">
          <StepActions onNextStep={onNextStep} />
        </Grid.Cell>
      </Grid>
    </>
  )
}

export default StepBinnenruimtes
