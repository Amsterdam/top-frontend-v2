import { useEffect, useRef } from "react"
import { useFieldArray, useFormContext, useWatch } from "react-hook-form"
import {
  Button,
  Grid,
  Heading,
  Paragraph,
} from "@amsterdam/design-system-react"
import { DeleteIcon, PlusIcon } from "@amsterdam/design-system-react-icons"
import { TextInputControl } from "@amsterdam/ee-ads-rhf"
import { REQUIRED_MESSAGES } from "../fieldDefinitions"
import {
  emptyVlak,
  formatM2,
  multiply,
  sumVlakken,
  vlakOppervlakteName,
} from "../helpers/oppervlakte"

type Props = {
  /** The form's room list this room is in. */
  name: "binnenruimtes" | "buitenruimtes"
  index: number
}

const GRID_CELL_SPAN_LENGTE_BREEDTE = { narrow: 2, medium: 2, wide: 2 } as const
const GRID_CELL_SPAN_OPPERVLAKTE = { narrow: 3, medium: 3, wide: 3 } as const
// The total sits under the rows' oppervlakte column, which starts after lengte and breedte
// (2 + 2 columns); at narrow the oppervlakte wraps onto its own line, at column 1.
const GRID_CELL_START_TOTAAL = { narrow: 1, medium: 5, wide: 5 } as const
const GRID_CELL_SPAN_TOEVOEGEN = { narrow: 4, medium: 4, wide: 4 } as const

const NUMBER_ATTRIBUTES = { type: "number", min: 0, step: 0.01 } as const

/** An empty `<input type="number">` must not receive `null`/`NaN` as its `value`. */
function toInputValue(value: number | null | undefined) {
  return value == null || Number.isNaN(value) ? "" : value
}

/**
 * The oppervlakte of one added binnen- or buitenruimte: one or more lengte x breedte =
 * oppervlakte rows, added up into the ruimte's oppervlakte. Below more than one row, the total.
 */
export function OppervlakteFields({ name, index }: Props) {
  const { control, getValues, setValue } =
    useFormContext<GebruikersinvoerFormValues>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: `${name}.${index}.vlakken` as const,
  })
  const vlakken = useWatch({
    control,
    name: `${name}.${index}.vlakken` as const,
  })

  // The ruimte's oppervlakte (what the backend gets) is the rows' total, also when that's
  // emptied. A ruimte without rows (none in the form yet) keeps the oppervlakte it has.
  const total = sumVlakken(vlakken)
  const hasRows = fields.length > 0
  useEffect(() => {
    if (!hasRows || total === getValues(`${name}.${index}.oppervlakte`)) return
    setValue(`${name}.${index}.oppervlakte`, total)
  }, [hasRows, total, name, index, getValues, setValue])

  const isMultiple = fields.length > 1

  return (
    <>
      <Grid.Cell span="all" appearance="transparent">
        <Heading level={3}>Oppervlakte</Heading>
        <Paragraph>
          Geef aan wat de oppervlakte is van de ruimte. Je mag de lengte en
          breedte invullen. Je kunt ook direct de oppervlakte invullen. Bestaat
          de ruimte uit meer delen, bijvoorbeeld een L-vorm? Voeg dan per deel
          een oppervlakte toe. Ruimte onder een schuin dak lager dan 1,5 meter
          telt niet mee in de oppervlakte.
        </Paragraph>
      </Grid.Cell>

      {fields.map((field, vlakIndex) => (
        <VlakFields
          key={field.id}
          name={name}
          index={index}
          vlakIndex={vlakIndex}
          // Numbered once there are more rows, so each input has its own name.
          number={isMultiple ? vlakIndex + 1 : undefined}
          onRemove={vlakIndex > 0 ? () => remove(vlakIndex) : undefined}
        />
      ))}

      <Grid.Cell
        start={1}
        span={GRID_CELL_SPAN_TOEVOEGEN}
        appearance="transparent"
      >
        <Button
          type="button"
          variant="tertiary"
          icon={PlusIcon}
          iconBefore
          onClick={() => append(emptyVlak())}
        >
          Oppervlakte toevoegen
        </Button>
      </Grid.Cell>
      {isMultiple && (
        <Grid.Cell
          start={GRID_CELL_START_TOTAAL}
          span={GRID_CELL_SPAN_OPPERVLAKTE}
          appearance="transparent"
        >
          <Paragraph aria-live="polite">
            Totaal: <strong>{total === null ? "–" : formatM2(total)}</strong>
          </Paragraph>
        </Grid.Cell>
      )}
    </>
  )
}

type VlakFieldsProps = Props & {
  vlakIndex: number
  /** Added to the labels when there is more than one row. */
  number?: number
  /** Only for the rows after the first one: a ruimte always has one. */
  onRemove?: () => void
}

/** One lengte x breedte = oppervlakte row; lengte x breedte fills in the oppervlakte. */
function VlakFields({
  name,
  index,
  vlakIndex,
  number,
  onRemove,
}: VlakFieldsProps) {
  const { control, setValue } = useFormContext<GebruikersinvoerFormValues>()
  const vlakName = `${name}.${index}.vlakken.${vlakIndex}` as const
  const oppervlakteName = vlakOppervlakteName(name, index, vlakIndex)

  const [lengte, breedte, oppervlakte] = useWatch({
    control,
    name: [
      `${vlakName}.lengte`,
      `${vlakName}.breedte`,
      oppervlakteName,
    ] as const,
  })

  // Lengte x breedte drive the oppervlakte, but it remains directly editable for rows where
  // only the oppervlakte itself is known. So only a change of the product overwrites it: not
  // opening a saved room, which would replace a typed-in oppervlakte.
  const product = multiply(lengte, breedte)
  const previousProduct = useRef(product)
  useEffect(() => {
    if (product === previousProduct.current) return
    previousProduct.current = product
    if (product === null) return

    setValue(oppervlakteName, product, { shouldValidate: true })
  }, [product, oppervlakteName, setValue])

  const label = (text: string, unit: string) =>
    `${text}${number ? ` ${number}` : ""} (${unit})`

  return (
    <>
      <Grid.Cell
        start={1}
        span={GRID_CELL_SPAN_LENGTE_BREEDTE}
        appearance="transparent"
        style={{ position: "relative" }}
      >
        <TextInputControl<GebruikersinvoerFormValues>
          label={label("Lengte", "m")}
          name={`${vlakName}.lengte`}
          attributes={{ ...NUMBER_ATTRIBUTES, value: toInputValue(lengte) }}
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
          label={label("Breedte", "m")}
          name={`${vlakName}.breedte`}
          attributes={{ ...NUMBER_ATTRIBUTES, value: toInputValue(breedte) }}
          registerOptions={{ valueAsNumber: true, min: 0 }}
          inFieldSet
        />
      </Grid.Cell>
      <Grid.Cell span={GRID_CELL_SPAN_OPPERVLAKTE} appearance="transparent">
        <TextInputControl<GebruikersinvoerFormValues>
          label={label("Oppervlakte", "m²")}
          name={oppervlakteName}
          attributes={{
            ...NUMBER_ATTRIBUTES,
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
      {onRemove && (
        <Grid.Cell span={1} appearance="transparent">
          <Button
            onClick={onRemove}
            icon={DeleteIcon}
            variant="tertiary"
            title={`Oppervlakte ${number} verwijderen`}
          />
        </Grid.Cell>
      )}
    </>
  )
}
