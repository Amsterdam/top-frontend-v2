import { useFormContext } from "react-hook-form"
import {
  ActionGroup,
  Button,
  Grid,
  Heading,
  InvalidFormAlert,
  Paragraph,
} from "@amsterdam/design-system-react"
import { SaveIcon } from "@amsterdam/design-system-react-icons"
import { mapErrorsToAlert, TextInputControl } from "@amsterdam/ee-ads-rhf"
import { OppervlakteFields } from "../components/OppervlakteFields"

type Props = {
  index: number
  label: string
  onSave: () => void
}

/** The oppervlakte and gemeenschappelijk questions for one added buitenruimte. */
export function BuitenruimteFields({ index, label, onSave }: Props) {
  const {
    trigger,
    formState: { errors },
  } = useFormContext<GebruikersinvoerFormValues>()

  // The required fields: oppervlakte (see the registerOptions in OppervlakteFields) and
  // aantal_adressen below.
  const oppervlakteName = `buitenruimtes.${index}.oppervlakte` as const
  const aantalAdressenName = `buitenruimtes.${index}.aantal_adressen` as const

  // mapErrorsToAlert only reads the top-level keys of the errors object, so the nested
  // buitenruimtes.<index>.* errors need to be flattened to their input `name` first.
  const roomErrors = errors.buitenruimtes?.[index]
  const alertErrors = mapErrorsToAlert({
    ...(roomErrors?.oppervlakte && {
      [oppervlakteName]: roomErrors.oppervlakte,
    }),
    ...(roomErrors?.aantal_adressen && {
      [aantalAdressenName]: roomErrors.aantal_adressen,
    }),
  })

  const handleSaveClick = async () => {
    if (await trigger([oppervlakteName, aantalAdressenName])) onSave()
  }

  return (
    <Grid gapVertical="large" className="align-items-end grid-in-cell">
      {alertErrors.length > 0 && (
        <Grid.Cell
          span={{ narrow: 4, medium: 6, wide: 7 }}
          appearance="transparent"
        >
          <InvalidFormAlert
            errors={alertErrors}
            headingLevel={4}
            className="ams-mb-m"
            data-testid="error-alert"
          />
        </Grid.Cell>
      )}
      <OppervlakteFields name="buitenruimtes" index={index} />

      <Grid.Cell span="all" appearance="transparent">
        <Heading level={3}>Gemeenschappelijke buitenruimte</Heading>
        <Paragraph>
          Geef hier op hoeveel adressen gebruik maken van deze buitenruimte. Is
          de ruimte privé? Dan is 1 het juiste getal. Let op: het gaat hier om het aantal adressen, niet om het aantal bewoners.
        </Paragraph>
      </Grid.Cell>
      <Grid.Cell
        span={{ narrow: 3, medium: 3, wide: 3 }}
        appearance="transparent"
      >
        <TextInputControl<GebruikersinvoerFormValues>
          label="Aantal adressen"
          name={aantalAdressenName}
          attributes={{ type: "number", min: 1, step: 1 }}
          registerOptions={{
            valueAsNumber: true,
            required: "Vul het aantal adressen in.",
            min: { value: 1, message: "Het aantal adressen is minimaal 1." },
          }}
          inFieldSet
        />
      </Grid.Cell>

      <Grid.Cell span="all" appearance="transparent">
        <ActionGroup>
          <Button
            type="button"
            icon={SaveIcon}
            iconBefore
            onClick={handleSaveClick}
            variant="secondary"
          >
            {label} toevoegen
          </Button>
        </ActionGroup>
      </Grid.Cell>
    </Grid>
  )
}
