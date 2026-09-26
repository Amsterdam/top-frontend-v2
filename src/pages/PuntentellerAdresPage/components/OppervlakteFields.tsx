import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { Grid, Heading, Paragraph } from "@amsterdam/design-system-react"
import { TextInputControl } from "@amsterdam/ee-ads-rhf"
import { REQUIRED_MESSAGES } from "../fieldDefinitions"

type Props = {
  /** The form's room list this room is in. */
  name: "binnenruimtes" | "buitenruimtes"
  index: number
}

const GRID_CELL_SPAN_LENGTE_BREEDTE = { narrow: 2, medium: 2, wide: 2 } as const
const GRID_CELL_SPAN_OPPERVLAKTE = { narrow: 3, medium: 3, wide: 3 } as const

/** An empty `<input type="number">` must not receive `null`/`NaN` as its `value`. */
function toInputValue(value: number | null | undefined) {
  return value == null || Number.isNaN(value) ? "" : value
}

/** The lengte x breedte -> oppervlakte calculator for one added binnen- or buitenruimte. */
export function OppervlakteFields({ name, index }: Props) {
  const { control, setValue } = useFormContext<GebruikersinvoerFormValues>()

  const lengte = useWatch({
    control,
    name: `${name}.${index}.lengte` as const,
  })
  const breedte = useWatch({
    control,
    name: `${name}.${index}.breedte` as const,
  })
  const oppervlakte = useWatch({
    control,
    name: `${name}.${index}.oppervlakte` as const,
  })

  // Lengte x breedte drive the oppervlakte, but it remains directly editable afterwards
  // for rooms where only the oppervlakte itself is known.
  useEffect(() => {
    if (lengte == null || breedte == null) return

    setValue(
      `${name}.${index}.oppervlakte`,
      Math.round(lengte * breedte * 100) / 100,
      { shouldValidate: true },
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lengte, breedte])

  return (
    <>
      <Grid.Cell span="all" appearance="transparent">
        <Heading level={3}>Oppervlakte</Heading>
        <Paragraph>
          Geef aan wat de oppervlakte is van de ruimte. Je mag de lengte en
          breedte invullen. Je kunt ook direct de oppervlakte invullen. Ruimte
          onder een schuin dak lager dan 1,5 meter telt niet mee in de
          oppervlakte.
        </Paragraph>
      </Grid.Cell>

      <Grid.Cell
        span={GRID_CELL_SPAN_LENGTE_BREEDTE}
        appearance="transparent"
        style={{ position: "relative" }}
      >
        <TextInputControl<GebruikersinvoerFormValues>
          label="Lengte (m)"
          name={`${name}.${index}.lengte` as const}
          attributes={{
            type: "number",
            min: 0,
            step: 0.01,
            value: toInputValue(lengte),
          }}
          registerOptions={{ valueAsNumber: true, min: 0 }}
          inFieldSet
        />
        {/* Absolutely positioned so it doesn't take a grid column itself, which would push
            breedte onto the next row at the narrow breakpoint (4 columns: 2 + 1 + 2 > 4). */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            insetInlineEnd: "calc(-1 * var(--ams-grid-column-gap) / 2)",
            insetBlockEnd: "0.75rem",
            transform: "translateX(50%)",
            fontFamily: "var(--ams-inputs-font-family)",
            fontSize: "var(--ams-inputs-font-size)",
          }}
        >
          x
        </span>
      </Grid.Cell>
      <Grid.Cell span={GRID_CELL_SPAN_LENGTE_BREEDTE} appearance="transparent">
        <TextInputControl<GebruikersinvoerFormValues>
          label="Breedte (m)"
          name={`${name}.${index}.breedte` as const}
          attributes={{
            type: "number",
            min: 0,
            step: 0.01,
            value: toInputValue(breedte),
          }}
          registerOptions={{ valueAsNumber: true, min: 0 }}
          inFieldSet
        />
      </Grid.Cell>
      <Grid.Cell span={GRID_CELL_SPAN_OPPERVLAKTE} appearance="transparent">
        <TextInputControl<GebruikersinvoerFormValues>
          label="Oppervlakte (m²)"
          name={`${name}.${index}.oppervlakte` as const}
          attributes={{
            type: "number",
            min: 0,
            step: 0.01,
            value: toInputValue(oppervlakte),
          }}
          registerOptions={{
            valueAsNumber: true,
            required: REQUIRED_MESSAGES.oppervlakte,
            min: 0,
          }}
          inFieldSet
        />
      </Grid.Cell>
    </>
  )
}
