import { Controller, useFormContext } from "react-hook-form"
import {
  ActionGroup,
  Button,
  ErrorMessage,
  Field,
  Grid,
  Heading,
  InvalidFormAlert,
  Label,
  Paragraph,
} from "@amsterdam/design-system-react"
import { SaveIcon } from "@amsterdam/design-system-react-icons"
import { mapErrorsToAlert, TextInputControl } from "@amsterdam/ee-ads-rhf"
import { NumberStepper } from "../components/NumberStepper"
import { OppervlakteFields } from "../components/OppervlakteFields"
import { QuantityCheckboxList } from "../components/QuantityCheckbox"
import { QuantityCheckboxField } from "../components/QuantityCheckboxField"
import {
  hasParkeerplek,
  PARKEERPLEK_FIELDS,
  REQUIRED_MESSAGES,
} from "../fieldDefinitions"

const MAX_PARKEERPLEKKEN = 999

type Props = {
  index: number
  label: string
  type: BuitenruimteType
  onSave: () => void
  /** Drops the room when it's a new one, or undoes the edits of a saved one. */
  onCancel: () => void
}

/**
 * The questions for one added buitenruimte: oppervlakte and aantal adressen, or for a
 * parkeerruimte aantal adressen, the parkeerplekken per soort and laadpalen instead of the
 * oppervlakte.
 */
export function BuitenruimteFields({
  index,
  label,
  type,
  onSave,
  onCancel,
}: Props) {
  const isParkeerruimte = type === "Parkeerruimte"
  const {
    trigger,
    formState: { errors },
  } = useFormContext<GebruikersinvoerFormValues>()

  // The required fields: oppervlakte (see the registerOptions in OppervlakteFields) and
  // aantal_adressen below, or for a parkeerruimte at least one parkeerplek (its aantal_adressen
  // is a stepper, which can't hold an invalid value).
  const oppervlakteName = `buitenruimtes.${index}.oppervlakte` as const
  const aantalAdressenName = `buitenruimtes.${index}.aantal_adressen` as const
  // The "at least one parkeerplek" rule sits on the first type's checkbox; the other types
  // revalidate it when they change (deps).
  const parkeerplekNames = PARKEERPLEK_FIELDS.map(
    ({ name }) => `buitenruimtes.${index}.${name}` as const,
  )
  const [parkeerplekkenName] = parkeerplekNames

  // mapErrorsToAlert only reads the top-level keys of the errors object, so the nested
  // buitenruimtes.<index>.* errors need to be flattened to their input `name` first.
  const roomErrors = errors.buitenruimtes?.[index]
  const parkeerplekkenError = roomErrors?.[PARKEERPLEK_FIELDS[0].name]
  const alertErrors = mapErrorsToAlert({
    ...(roomErrors?.oppervlakte && {
      [oppervlakteName]: roomErrors.oppervlakte,
    }),
    ...(roomErrors?.aantal_adressen && {
      [aantalAdressenName]: roomErrors.aantal_adressen,
    }),
    ...(parkeerplekkenError && { [parkeerplekkenName]: parkeerplekkenError }),
  })

  const handleSaveClick = async () => {
    const requiredFieldNames = isParkeerruimte
      ? [parkeerplekkenName]
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
      {isParkeerruimte ? (
        <Grid.Cell span="all" appearance="transparent">
          <Paragraph>
            Voeg elke groep parkeerplekken apart toe. Heb je bijvoorbeeld 1
            eigen overdekte parkeerplek met een laadpaal en daarnaast 20
            gedeelde plekken buiten met 4 laadpalen? Voer die dan als 2 aparte
            parkeerruimtes op.
          </Paragraph>
        </Grid.Cell>
      ) : (
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
        {isParkeerruimte ? (
          <Field>
            <Label htmlFor={aantalAdressenName} inFieldSet>
              Hoeveel adressen kunnen gebruik maken van de parkeerruimte(s)?
            </Label>
            <Controller<GebruikersinvoerFormValues>
              name={aantalAdressenName}
              render={({ field: { value, onChange } }) => (
                <NumberStepper
                  id={aantalAdressenName}
                  label="Aantal adressen"
                  value={Number(value) || 1}
                  onChange={onChange}
                  max={MAX_PARKEERPLEKKEN}
                  size={3}
                  hasVisibleLabel
                />
              )}
            />
          </Field>
        ) : (
          <TextInputControl<GebruikersinvoerFormValues>
            label="Aantal adressen"
            name={aantalAdressenName}
            attributes={{ type: "number", min: 1, step: 1 }}
            size={2}
            registerOptions={{
              valueAsNumber: true,
              required: REQUIRED_MESSAGES.aantal_adressen,
              min: { value: 1, message: "Het aantal adressen is minimaal 1." },
              // TextInputControl renders a Controller, which ignores valueAsNumber, so the value
              // arrives as the input's string ("2") and needs converting first.
              validate: (value) =>
                Number.isInteger(Number(value)) || "Vul een heel getal in.",
            }}
            inFieldSet
          />
        )}
      </Grid.Cell>

      {isParkeerruimte && (
        <>
          <Grid.Cell span="all" appearance="transparent">
            <Heading level={3}>Kies het type parkeerplek</Heading>
            <Paragraph className="ams-mb-m">
              Geef aan hoeveel parkeerplekken er van elk type zijn.
            </Paragraph>
            <Field invalid={!!parkeerplekkenError}>
              {parkeerplekkenError && (
                <ErrorMessage>{parkeerplekkenError.message}</ErrorMessage>
              )}
              <QuantityCheckboxList>
                {PARKEERPLEK_FIELDS.map((field, fieldIndex) => (
                  <QuantityCheckboxField
                    key={field.name}
                    name={parkeerplekNames[fieldIndex]}
                    label={field.label}
                    max={MAX_PARKEERPLEKKEN}
                    rules={
                      fieldIndex === 0
                        ? {
                            validate: (_, values) =>
                              hasParkeerplek(values.buitenruimtes?.[index]) ||
                              REQUIRED_MESSAGES.parkeerplekken,
                          }
                        : { deps: [parkeerplekkenName] }
                    }
                  />
                ))}
              </QuantityCheckboxList>
            </Field>
          </Grid.Cell>

          <Grid.Cell span="all" appearance="transparent">
            <Heading level={3} className="ams-mb-m">
              Laadpalen
            </Heading>
            <Paragraph className="ams-mb-m">
              Zijn er laadpalen bij deze parkeerplekken? Vul het totale aantal
              laadpalen in, ongeacht bij welk type parkeerplek ze staan.
            </Paragraph>
            <QuantityCheckboxList>
              <QuantityCheckboxField
                name={`buitenruimtes.${index}.laadpaal`}
                label="Laadpaal"
                max={MAX_PARKEERPLEKKEN}
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
          <Button type="button" onClick={onCancel} variant="tertiary">
            Annuleren
          </Button>
        </ActionGroup>
      </Grid.Cell>
    </Grid>
  )
}
