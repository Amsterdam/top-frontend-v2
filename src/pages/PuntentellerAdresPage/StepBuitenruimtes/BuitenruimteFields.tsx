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
import { QuantityCheckboxList } from "../components/QuantityCheckbox"
import { QuantityCheckboxField } from "../components/QuantityCheckboxField"
import { PARKEERPLEK_FIELDS } from "../fieldDefinitions"

const MAX_PARKEERPLEKKEN = 50

type Props = {
  index: number
  label: string
  type: BuitenruimteType
  onSave: () => void
}

/**
 * The questions for one added buitenruimte: oppervlakte and aantal adressen, or for a
 * parkeerruimte aantal adressen, the parkeerplekken per soort and laadpalen instead of the
 * oppervlakte.
 */
export function BuitenruimteFields({ index, label, type, onSave }: Props) {
  const isParkeerruimte = type === "Parkeerruimte"
  const {
    trigger,
    formState: { errors },
  } = useFormContext<GebruikersinvoerFormValues>()

  // The required fields: oppervlakte (see the registerOptions in OppervlakteFields, not asked
  // for a parkeerruimte) and aantal_adressen below.
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
    const requiredFieldNames = isParkeerruimte
      ? [aantalAdressenName]
      : [oppervlakteName, aantalAdressenName]
    if (await trigger(requiredFieldNames)) onSave()
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
      {!isParkeerruimte && (
        <OppervlakteFields name="buitenruimtes" index={index} />
      )}

      {!isParkeerruimte && (
        <Grid.Cell span="all" appearance="transparent">
          <Heading level={3}>Gemeenschappelijke buitenruimte</Heading>
          <Paragraph>
            Geef hier op hoeveel adressen gebruik maken van deze buitenruimte.
            Is de ruimte privé? Dan is 1 het juiste getal. Let op: het gaat hier
            om het aantal adressen, niet om het aantal bewoners.
          </Paragraph>
        </Grid.Cell>
      )}
      <Grid.Cell span="all" appearance="transparent">
        <TextInputControl<GebruikersinvoerFormValues>
          label={
            isParkeerruimte
              ? "Hoeveel adressen kunnen gebruik maken van de parkeerruimte?"
              : "Aantal adressen"
          }
          name={aantalAdressenName}
          attributes={{ type: "number", min: 1, step: 1 }}
          size={2}
          registerOptions={{
            valueAsNumber: true,
            required: "Vul het aantal adressen in.",
            min: { value: 1, message: "Het aantal adressen is minimaal 1." },
            // TextInputControl renders a Controller, which ignores valueAsNumber, so the value
            // arrives as the input's string ("2") and needs converting first.
            validate: (value) =>
              Number.isInteger(Number(value)) || "Vul een heel getal in.",
          }}
          inFieldSet
        />
      </Grid.Cell>

      {isParkeerruimte && (
        <>
          <Grid.Cell span="all" appearance="transparent">
            <Heading level={3}>Parkeerplekken</Heading>
            <Paragraph className="ams-mb-m">
              Geef aan hoeveel parkeerplekken er zijn.
            </Paragraph>
            <QuantityCheckboxList>
              {PARKEERPLEK_FIELDS.map((field) => (
                <QuantityCheckboxField
                  key={field.name}
                  name={`buitenruimtes.${index}.${field.name}`}
                  label={field.label}
                  max={MAX_PARKEERPLEKKEN}
                />
              ))}
            </QuantityCheckboxList>
          </Grid.Cell>

          <Grid.Cell span="all" appearance="transparent">
            <Heading level={3} className="ams-mb-m">
              Laadpaal
            </Heading>
            <QuantityCheckboxList>
              <QuantityCheckboxField
                name={`buitenruimtes.${index}.laadpaal`}
                label="Laadpaal"
              />
            </QuantityCheckboxList>
          </Grid.Cell>
        </>
      )}

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
