import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import {
  Column,
  Grid,
  Heading,
  Paragraph,
} from "@amsterdam/design-system-react"
import { RadioControl, TextInputControl } from "@amsterdam/ee-ads-rhf"
import { StepActions } from "../components/StepActions"
import { StepInvalidFormAlert } from "../components/StepInvalidFormAlert"
import {
  BIJZONDERHEDEN_FIELDS,
  BIJZONDERHEDEN_SECTIONS,
  GEEN_MONUMENT,
  JA_NEE_OPTIONS,
  type BijzonderhedenField as BijzonderhedenFieldDefinition,
  type TopLevelFieldName,
} from "../fieldDefinitions"

/** The fields of this step in page order, for the StepInvalidFormAlert. */
const FIELD_NAMES: TopLevelFieldName[] = BIJZONDERHEDEN_FIELDS.flatMap(
  ({ name, followUp }) => (followUp ? [name, followUp.name] : [name]),
)

type BijzonderhedenFieldProps = {
  field: BijzonderhedenFieldDefinition
  inFieldSet: boolean
}

/** A radio question, followed by its follow-up field once it's answered ja. */
function BijzonderhedenField({
  field: { name, label, required, options = JA_NEE_OPTIONS, followUp },
  inFieldSet,
}: BijzonderhedenFieldProps) {
  return (
    <>
      <RadioControl<GebruikersinvoerFormValues>
        label={label}
        name={name}
        options={[...options]}
        registerOptions={{ required }}
        inFieldSet={inFieldSet}
      />
      {followUp && (
        <TextInputControl<GebruikersinvoerFormValues>
          label={followUp.label}
          description={followUp.description}
          name={followUp.name}
          registerOptions={{ required: followUp.required }}
          shouldShow={(watch) => watch(name) === "true"}
          inFieldSet={inFieldSet}
          size={6}
        />
      )}
    </>
  )
}

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
      <StepInvalidFormAlert fieldNames={FIELD_NAMES} />

      <Grid.Cell span="all">
        <Column gap="large">
          <Heading level={2}>Bijzonderheden</Heading>

          {BIJZONDERHEDEN_SECTIONS.map(({ heading, description, fields }) => (
            <Column gap="large" key={heading ?? fields[0].name}>
              {heading && (
                <Column gap="small">
                  <Heading level={3}>{heading}</Heading>
                  {description && <Paragraph>{description}</Paragraph>}
                </Column>
              )}
              {fields.map((field) => (
                <BijzonderhedenField
                  key={field.name}
                  field={field}
                  inFieldSet={Boolean(heading)}
                />
              ))}
            </Column>
          ))}
        </Column>
      </Grid.Cell>

      <Grid.Cell span="all" appearance="transparent">
        <StepActions onNextStep={onNextStep} nextStepLabel="Naar overzicht" />
      </Grid.Cell>
    </>
  )
}

export default StepBijzonderheden
