import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { Grid, Heading, Paragraph } from "@amsterdam/design-system-react"
import { TextInputControl } from "@amsterdam/ee-ads-rhf"

type Props = {
  index: number
}

const GRID_CELL_SPAN_OPPERVLAKTE = { narrow: 2, medium: 2, wide: 2 } as const

/** An empty `<input type="number">` must not receive `null`/`NaN` as its `value`. */
function toInputValue(value: number | null | undefined) {
  return value == null || Number.isNaN(value) ? "" : value
}

/** The lengte x breedte -> oppervlakte calculator for one added binnenruimte. */
export function OppervlakteFields({ index }: Props) {
  const { control, setValue } = useFormContext<GebruikersinvoerFormValues>()

  const lengte = useWatch({
    control,
    name: `binnenruimtes.${index}.lengte` as const,
  })
  const breedte = useWatch({
    control,
    name: `binnenruimtes.${index}.breedte` as const,
  })
  const oppervlakte = useWatch({
    control,
    name: `binnenruimtes.${index}.oppervlakte` as const,
  })

  // Lengte x breedte drive the oppervlakte, but it remains directly editable afterwards
  // for rooms where only the oppervlakte itself is known.
  useEffect(() => {
    if (lengte == null || breedte == null) return

    setValue(
      `binnenruimtes.${index}.oppervlakte`,
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

      <Grid.Cell span={GRID_CELL_SPAN_OPPERVLAKTE} appearance="transparent">
        <TextInputControl<GebruikersinvoerFormValues>
          label="Lengte (m)"
          name={`binnenruimtes.${index}.lengte` as const}
          attributes={{
            type: "number",
            min: 0,
            step: 0.01,
            value: toInputValue(lengte),
          }}
          registerOptions={{ valueAsNumber: true, min: 0 }}
          inFieldSet
        />
      </Grid.Cell>
      <Grid.Cell span={GRID_CELL_SPAN_OPPERVLAKTE} appearance="transparent">
        <TextInputControl<GebruikersinvoerFormValues>
          label="Breedte (m)"
          name={`binnenruimtes.${index}.breedte` as const}
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
          name={`binnenruimtes.${index}.oppervlakte` as const}
          attributes={{
            type: "number",
            min: 0,
            step: 0.01,
            value: toInputValue(oppervlakte),
          }}
          registerOptions={{
            valueAsNumber: true,
            required: "Oppervlakte is verplicht",
            min: 0,
          }}
          inFieldSet
        />
      </Grid.Cell>
    </>
  )
}
