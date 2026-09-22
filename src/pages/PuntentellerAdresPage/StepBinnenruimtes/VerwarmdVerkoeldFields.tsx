import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { Grid, Heading, Paragraph } from "@amsterdam/design-system-react"
import { RadioControl } from "@amsterdam/ee-ads-rhf"

type Props = {
  index: number
  label: string
  /** Some binnenruimte types (e.g. toiletruimte) can never be verkoeld, so the question doesn't apply. */
  hasVerkoeld: boolean
  /** Whether this type asks the verwarmd question at all; defaults to true. When false, verwarmd
   * is always forced to "ja" without asking. */
  hasVerwarmd?: boolean
}

const GRID_CELL_SPAN_VERWARMD_VERKOELD = {
  narrow: 4,
  medium: 4,
  wide: 5,
} as const

/** The verwarmd/verkoeld questions for one added binnenruimte. */
export function VerwarmdVerkoeldFields({
  index,
  label,
  hasVerkoeld,
  hasVerwarmd = true,
}: Props) {
  const { control, setValue } = useFormContext<GebruikersinvoerFormValues>()

  const verwarmd = useWatch({
    control,
    name: `binnenruimtes.${index}.verwarmd` as const,
  })
  const verwarmdIsJa = hasVerwarmd ? verwarmd === "true" : true

  // Types that don't ask the verwarmd question are always treated as verwarmd.
  useEffect(() => {
    if (hasVerwarmd) return

    setValue(`binnenruimtes.${index}.verwarmd`, "true", {
      shouldValidate: true,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasVerwarmd, index])

  // Verkoeld can only be "ja" when the room is also verwarmd; otherwise it's forced to "nee".
  // For types that don't support verkoeld at all, it's always forced to "nee".
  useEffect(() => {
    if (hasVerkoeld && verwarmdIsJa) return

    setValue(`binnenruimtes.${index}.verkoeld`, "false", {
      shouldValidate: true,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasVerkoeld, verwarmdIsJa, index])

  // Nothing to ask (and thus nothing to show) for types that neither ask verwarmd nor
  // verkoeld; the effects above already forced both to their fixed values.
  if (!hasVerwarmd && !hasVerkoeld) return null

  return (
    <>
      <Grid.Cell span="all" appearance="transparent">
        <Heading level={3}>Verwarmde ruimte</Heading>
        <Paragraph>
          Een airco of ander koelsysteem moet minimaal energielabel A+ hebben om
          mee te tellen voor de puntentelling. Daarvoor moet het vermogen
          minimaal 100 W/m2 zijn bij een werkingstemperatuur tot 35 °C.
        </Paragraph>
      </Grid.Cell>
      {hasVerwarmd && (
        <Grid.Cell
          span={GRID_CELL_SPAN_VERWARMD_VERKOELD}
          appearance="transparent"
        >
          <RadioControl<GebruikersinvoerFormValues>
            label={`${label} verwarmd?`}
            name={`binnenruimtes.${index}.verwarmd` as const}
            options={[
              { label: "Nee", value: "false" },
              { label: "Ja", value: "true" },
            ]}
            registerOptions={{ required: "Geef aan of de ruimte verwarmd is" }}
            inFieldSet
          />
        </Grid.Cell>
      )}

      {hasVerkoeld && (
        <Grid.Cell
          span={GRID_CELL_SPAN_VERWARMD_VERKOELD}
          appearance="transparent"
        >
          <RadioControl<GebruikersinvoerFormValues>
            label={`${label} verkoeld?`}
            name={`binnenruimtes.${index}.verkoeld` as const}
            options={[
              { label: "Nee", value: "false" },
              { label: "Ja", value: "true" },
            ]}
            registerOptions={{ required: "Geef aan of de ruimte verkoeld is" }}
            disabled={!verwarmdIsJa}
            inFieldSet
          />
        </Grid.Cell>
      )}
    </>
  )
}
