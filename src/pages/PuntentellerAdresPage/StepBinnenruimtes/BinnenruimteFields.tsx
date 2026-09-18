import { useEffect } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import {
  ActionGroup,
  Button,
  Grid,
  Heading,
  Paragraph,
} from "@amsterdam/design-system-react"
import { SaveIcon } from "@amsterdam/design-system-react-icons"
import { RadioControl, TextInputControl } from "@amsterdam/ee-ads-rhf"

type Props = {
  index: number
  label: string
  onSave: () => void
}

const GRID_CELL_SPAN_OPPERVLAKTE = { narrow: 2, medium: 2, wide: 2 } as const
const GRID_CELL_SPAN_VERWARMD_VERKOELD = {
  narrow: 4,
  medium: 4,
  wide: 5,
} as const

/** An empty `<input type="number">` must not receive `null`/`NaN` as its `value`. */
function toInputValue(value: number | null | undefined) {
  return value == null || Number.isNaN(value) ? "" : value
}

/** The oppervlakte calculator + verwarmd/verkoeld questions for one added binnenruimte. */
export function BinnenruimteFields({ index, label, onSave }: Props) {
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
  const verwarmd = useWatch({
    control,
    name: `binnenruimtes.${index}.verwarmd` as const,
  })
  const verkoeld = useWatch({
    control,
    name: `binnenruimtes.${index}.verkoeld` as const,
  })

  // Mirrors the registerOptions below: oppervlakte, verwarmd and verkoeld are the required
  // fields for a room, lengte/breedte stay optional since oppervlakte can be filled directly.
  const canSave =
    oppervlakte != null &&
    !Number.isNaN(oppervlakte) &&
    verwarmd != null &&
    verkoeld != null

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
    <Grid gapVertical="large" className="align-items-end padding-Inline-start">
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

      <Grid.Cell span="all" appearance="transparent">
        <Heading level={3}>Verwarmde ruimte</Heading>
        <Paragraph>
          Een airco of ander koelsysteem moet minimaal energielabel A+ hebben om
          mee te tellen voor de puntentelling. Daarvoor moet het vermogen
          minimaal 100 W/m2 zijn bij een werkingstemperatuur tot 35 °C.
        </Paragraph>
      </Grid.Cell>
      <Grid.Cell span={GRID_CELL_SPAN_VERWARMD_VERKOELD} appearance="transparent">
        <RadioControl<GebruikersinvoerFormValues>
          label={`${label} verwarmd?`}
          name={`binnenruimtes.${index}.verwarmd` as const}
          options={[
            { label: "Nee", value: "false" },
            { label: "Ja", value: "true" },
          ]}
          registerOptions={{ required: "Deze vraag is verplicht" }}
          inFieldSet
        />
      </Grid.Cell>

      <Grid.Cell span={GRID_CELL_SPAN_VERWARMD_VERKOELD} appearance="transparent">
        <RadioControl<GebruikersinvoerFormValues>
          label={`${label} verkoeld?`}
          name={`binnenruimtes.${index}.verkoeld` as const}
          options={[
            { label: "Nee", value: "false" },
            { label: "Ja", value: "true" },
          ]}
          registerOptions={{ required: "Deze vraag is verplicht" }}
          inFieldSet
        />
      </Grid.Cell>

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
