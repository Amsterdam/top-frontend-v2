import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { Column, Grid, Heading } from "@amsterdam/design-system-react"
import { RadioControl } from "@amsterdam/ee-ads-rhf"
import { StepActions } from "../components/StepActions"
import {
  GEEN_MONUMENT,
  JA_NEE_OPTIONS,
  JA_NEE_VRAGEN,
  MONUMENT_SOORT_OPTIONS,
} from "../fieldDefinitions"

type Props = {
  onNextStep: () => void
}

export function StepBijzonderheden({ onNextStep }: Props) {
  const { control, setValue } = useFormContext<GebruikersinvoerFormValues>()

  // monument follows the chosen monument_soort, so the two can't contradict each other.
  const monumentSoort = useWatch({ control, name: "monument_soort" })
  useEffect(() => {
    if (!monumentSoort) return
    setValue("monument", monumentSoort !== GEEN_MONUMENT)
  }, [monumentSoort, setValue])

  return (
    <>
      <Grid.Cell span="all">
        <Column gap="large">
          <Heading level={2}>Bijzonderheden</Heading>

          <RadioControl<GebruikersinvoerFormValues>
            label="Is de woning (onderdeel van) een monument?"
            name="monument_soort"
            options={MONUMENT_SOORT_OPTIONS}
            registerOptions={{
              required: "Geef aan of de woning een monument is",
            }}
          />

          {JA_NEE_VRAGEN.map(({ name, label, required }) => (
            <RadioControl<GebruikersinvoerFormValues>
              key={name}
              label={label}
              name={name}
              options={JA_NEE_OPTIONS}
              registerOptions={{ required }}
            />
          ))}
        </Column>
      </Grid.Cell>

      <Grid.Cell span="all" appearance="transparent">
        <StepActions onNextStep={onNextStep} />
      </Grid.Cell>
    </>
  )
}

export default StepBijzonderheden
