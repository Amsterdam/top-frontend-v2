import { Fragment } from "react"
import { useFormContext, useWatch, type Path } from "react-hook-form"
import {
  ActionGroup,
  Button,
  Grid,
  Heading,
  Paragraph,
} from "@amsterdam/design-system-react"
import { SaveIcon } from "@amsterdam/design-system-react-icons"
import { SelectFieldGrid } from "../components/SelectFieldGrid"
import { BINNENRUIMTE_CONFIG } from "./binnenruimteConfig"
import { OppervlakteFields } from "./OppervlakteFields"
import { VerwarmdVerkoeldFields } from "./VerwarmdVerkoeldFields"

type Props = {
  index: number
  label: string
  type: BinnenruimteType
  onSave: () => void
}

/** The oppervlakte calculator + verwarmd/verkoeld questions for one added binnenruimte. */
export function BinnenruimteFields({ index, label, type, onSave }: Props) {
  const { control } = useFormContext<GebruikersinvoerFormValues>()
  const { hasVerkoeld, extra } = BINNENRUIMTE_CONFIG[type]

  const oppervlakte = useWatch({
    control,
    name: `binnenruimtes.${index}.oppervlakte` as const,
  })
  const verwarmd = useWatch({
    control,
    name: `binnenruimtes.${index}.verwarmd` as const,
  })
  const verkoeld = useWatch({
    control,
    name: `binnenruimtes.${index}.verkoeld` as const,
  })

  const requiredExtraFieldNames = (extra ?? [])
    .flatMap((section) => section.fields)
    .filter((field) => field.required)
    .map((field) => field.name as Path<GebruikersinvoerFormValues>)
  const requiredExtraFieldValues = useWatch({
    control,
    name: requiredExtraFieldNames,
  })
  const requiredExtraFieldsAnswered = requiredExtraFieldValues.every(
    (value) => value != null && value !== "",
  )

  // Mirrors the registerOptions in OppervlakteFields/VerwarmdVerkoeldFields: oppervlakte,
  // verwarmd and verkoeld are the required fields for a room, lengte/breedte stay optional
  // since oppervlakte can be filled directly. Verkoeld is always forced to a value (see
  // VerwarmdVerkoeldFields), even for types without the question, so this check needs no
  // extra case for hasVerkoeld. Required extra fields (e.g. aanrechtlengte) mirror the
  // `required` set on them in fieldDefinitions.ts.
  const canSave =
    oppervlakte != null &&
    !Number.isNaN(oppervlakte) &&
    verwarmd != null &&
    verkoeld != null &&
    requiredExtraFieldsAnswered

  return (
    <Grid gapVertical="large" className="align-items-end padding-Inline-start">
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
            disabled={!canSave}
            onClick={onSave}
          >
            {label} opslaan
          </Button>
        </ActionGroup>
      </Grid.Cell>
    </Grid>
  )
}
