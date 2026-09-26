import { useFieldArray, useFormContext, useWatch } from "react-hook-form"
import {
  Accordion,
  Column,
  Grid,
  Heading,
  Paragraph,
} from "@amsterdam/design-system-react"
import { RuimteTable } from "../components/RuimteTable"
import { RuimteTypeButtons } from "../components/RuimteTypeButtons"
import { StepActions } from "../components/StepActions"
import { getRoomLabels } from "../helpers/getRoomLabels"
import { useOpenRoom } from "../helpers/useOpenRoom"
import { BinnenruimteFields } from "./BinnenruimteFields"
import { emptyVoorzieningen } from "./binnenruimteConfig"

const BINNENRUIMTE_TYPES: BinnenruimteType[] = [
  "Woonkamer",
  "Keuken",
  "Woonkamer met open keuken",
  "Slaapkamer",
  "Badkamer",
  "Toiletruimte",
]

const ANDERE_BINNENRUIMTE_TYPES: BinnenruimteType[] = [
  "Woon- en slaapkamer",
  "Slaapkamer met wastafel, douche of bad",
  "Woon- en slaapkamer met keuken",
  "Overloop",
  "Kleine kamer (kleiner dan 4 m²)",
  "Wasruimte / bijkeuken",
  "Berging",
  "Garage",
  "Kelder",
  "Zolder",
  "Zolderberging met vaste trap",
  "Zolderberging zonder vaste trap",
]

const KEUKEN_BAD_ANDERE_RUIMTE_TYPES: BinnenruimteType[] = [
  "Bad, douche of wastafel in andere ruimte",
  "Keuken in andere ruimte",
]

const emptyBinnenruimte = (type: BinnenruimteType): Binnenruimte => ({
  type,
  lengte: null,
  breedte: null,
  oppervlakte: null,
  verwarmd: null,
  verkoeld: null,
  ...emptyVoorzieningen(type),
})

type Props = {
  onNextStep: () => void
}

export function StepBinnenruimtes({ onNextStep }: Props) {
  const { control, getValues, clearErrors } =
    useFormContext<GebruikersinvoerFormValues>()
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "binnenruimtes",
  })
  // useFieldArray's fields only reflect each room's values as of the last append/remove, not
  // live edits (e.g. oppervlakte), so the table needs the watched values merged in for those.
  const watchedRooms = useWatch({ control, name: "binnenruimtes" }) ?? []
  const rooms = fields.map((field, index) => ({
    ...field,
    ...watchedRooms[index],
  }))
  const roomLabels = getRoomLabels(fields)
  const {
    openIndex,
    add,
    edit,
    save,
    cancel,
    remove: removeRoom,
  } = useOpenRoom({
    count: fields.length,
    append,
    remove,
    getRoom: (index) => getValues(`binnenruimtes.${index}`),
    restore: (index, room) => {
      update(index, room)
      clearErrors(`binnenruimtes.${index}`)
    },
  })
  const openType = openIndex !== null ? fields[openIndex]?.type : undefined
  const handleAdd = (type: BinnenruimteType) => add(emptyBinnenruimte(type))

  return (
    <>
      <Grid.Cell span="all">
        <Column gap="large">
          <Heading level={2}>Binnenruimtes</Heading>
          <Paragraph>
            Uit welke binnenruimtes bestaat de woning? Vul de oppervlakte per
            ruimte in. Doe dit voor alle binnenruimtes in de woning. Alle
            ruimtes in de woning tellen mee in de puntentelling.
          </Paragraph>

          <RuimteTable
            soort="Binnenruimte"
            rooms={rooms}
            roomLabels={roomLabels}
            openIndex={openIndex}
            onEdit={edit}
            onRemove={removeRoom}
          />

          <Column gap="small">
            <Heading level={3}>Kies een binnenruimte</Heading>
            <Paragraph className="ams-mb-m">
              Welke binnenruimtes zijn er voor eigen gebruik? Vul ze één voor
              één in.
            </Paragraph>
            <RuimteTypeButtons
              types={BINNENRUIMTE_TYPES}
              openType={openType}
              onAdd={handleAdd}
            />
          </Column>

          <Accordion headingLevel={3}>
            <Accordion.Section label="Andere binnenruimtes">
              <RuimteTypeButtons
                types={ANDERE_BINNENRUIMTE_TYPES}
                openType={openType}
                onAdd={handleAdd}
              />
            </Accordion.Section>
            <Accordion.Section label="Keuken, bad, douche of wastafel in andere ruimte">
              <RuimteTypeButtons
                types={KEUKEN_BAD_ANDERE_RUIMTE_TYPES}
                openType={openType}
                onAdd={handleAdd}
              />
            </Accordion.Section>
          </Accordion>
        </Column>
      </Grid.Cell>

      {openIndex !== null && (
        <Grid.Cell span="all">
          <Heading level={2} className="ams-mb-m">
            {roomLabels[openIndex]}
          </Heading>
          <BinnenruimteFields
            index={openIndex}
            label={roomLabels[openIndex]}
            type={fields[openIndex].type}
            onSave={save}
            onCancel={cancel}
          />
        </Grid.Cell>
      )}

      <Grid.Cell span="all" appearance="transparent">
        <StepActions onNextStep={onNextStep} />
      </Grid.Cell>
    </>
  )
}

export default StepBinnenruimtes
