import { Fragment } from "react"
import { useFormContext, type FieldError, type Path } from "react-hook-form"
import {
  ActionGroup,
  Button,
  Grid,
  Heading,
  InvalidFormAlert,
  Paragraph,
} from "@amsterdam/design-system-react"
import { SaveIcon } from "@amsterdam/design-system-react-icons"
import { SelectFieldGrid } from "../components/SelectFieldGrid"
import { BINNENRUIMTE_CONFIG } from "./binnenruimteConfig"
import { OppervlakteFields } from "./OppervlakteFields"
import { VerwarmdVerkoeldFields } from "./VerwarmdVerkoeldFields"
import { mapErrorsToAlert } from "@amsterdam/ee-ads-rhf"

type Props = {
  index: number
  label: string
  type: BinnenruimteType
  onSave: () => void
}

/** The oppervlakte calculator + verwarmd/verkoeld questions for one added binnenruimte. */
export function BinnenruimteFields({ index, label, type, onSave }: Props) {
  const {
    trigger,
    formState: { errors },
  } = useFormContext<GebruikersinvoerFormValues>()
  const { hasVerkoeld, extra } = BINNENRUIMTE_CONFIG[type]

  // Mirrors the registerOptions in OppervlakteFields/VerwarmdVerkoeldFields: oppervlakte,
  // verwarmd and verkoeld are the required fields for a room, lengte/breedte stay optional
  // since oppervlakte can be filled directly. Verkoeld is always forced to a value (see
  // VerwarmdVerkoeldFields), even for types without the question, so this list needs no
  // extra case for hasVerkoeld. Required extra fields (e.g. aanrechtlengte) mirror the
  // `required` set on them in fieldDefinitions.ts.
  const requiredExtraFieldNames = (extra ?? [])
    .flatMap((section) => section.fields)
    .filter((field) => field.required)
    .map((field) => field.name as Path<GebruikersinvoerFormValues>)

  const requiredFieldNames = [
    `binnenruimtes.${index}.oppervlakte` as const,
    `binnenruimtes.${index}.verwarmd` as const,
    `binnenruimtes.${index}.verkoeld` as const,
    ...requiredExtraFieldNames,
  ]

  // mapErrorsToAlert only reads the top-level keys of the errors object, so the nested
  // binnenruimtes.<index>.* errors need to be flattened to their input `name` first.
  const roomErrors = errors.binnenruimtes?.[index]
  const topLevelErrors = errors as Record<string, FieldError | undefined>
  const alertErrors = mapErrorsToAlert({
    ...(roomErrors?.oppervlakte && {
      [`binnenruimtes.${index}.oppervlakte`]: roomErrors.oppervlakte,
    }),
    ...(roomErrors?.verwarmd && {
      [`binnenruimtes.${index}.verwarmd`]: roomErrors.verwarmd,
    }),
    ...(roomErrors?.verkoeld && {
      [`binnenruimtes.${index}.verkoeld`]: roomErrors.verkoeld,
    }),
    ...Object.fromEntries(
      requiredExtraFieldNames
        .filter((name) => topLevelErrors[name])
        .map((name) => [name, topLevelErrors[name]]),
    ),
  })
  const showErrors = alertErrors.length > 0

  const handleSaveClick = async () => {
    if (await trigger(requiredFieldNames)) onSave()
  }

  return (
    <Grid gapVertical="large" className="align-items-end padding-Inline-start">
      {showErrors && (
        <Grid.Cell span={{ narrow: 4, medium: 6, wide: 7 }} appearance="transparent">
          <InvalidFormAlert
            errors={alertErrors}
            headingLevel={4}
            className="ams-mb-m"
            data-testid="error-alert"
          />
        </Grid.Cell>
      )}
      <OppervlakteFields index={index} />

      <VerwarmdVerkoeldFields
        index={index}
        label={label}
        hasVerkoeld={hasVerkoeld}
      />

      {extra?.map((section) => (
        <Fragment key={section.heading}>
          <Grid.Cell span="all" appearance="transparent">
            <Heading level={3}>{section.heading}</Heading>
            {section.description && (
              <Paragraph>{section.description}</Paragraph>
            )}
          </Grid.Cell>
          <Grid.Cell span="all" appearance="transparent">
            <SelectFieldGrid fields={section.fields} />
          </Grid.Cell>
        </Fragment>
      ))}

      <Grid.Cell span="all" appearance="transparent">
        <ActionGroup>
          <Button
            type="button"
            icon={SaveIcon}
            iconBefore
            onClick={handleSaveClick}
          >
            {label} opslaan
          </Button>
        </ActionGroup>
      </Grid.Cell>
    </Grid>
  )
}
