import { useState } from "react"
import { useFieldArray, useFormContext, useWatch } from "react-hook-form"
import {
  Accordion,
  Button,
  Column,
  Grid,
  Heading,
  Paragraph,
  Row,
} from "@amsterdam/design-system-react"
import { CheckMarkIcon, PlusIcon } from "@amsterdam/design-system-react-icons"
import { StepActions } from "../components/StepActions"
import { BinnenruimteFields } from "./BinnenruimteFields"
import { BinnenruimteTable } from "./BinnenruimteTable"

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
})

/** "Slaapkamer" becomes "Slaapkamer 1", "Slaapkamer 2", ... only when a type occurs more than once. */
function getRoomLabels(rooms: { type: BinnenruimteType }[]) {
  const seen: Partial<Record<BinnenruimteType, number>> = {}
  const totals: Partial<Record<BinnenruimteType, number>> = {}
  for (const room of rooms) {
    totals[room.type] = (totals[room.type] ?? 0) + 1
  }
  return rooms.map((room) => {
    seen[room.type] = (seen[room.type] ?? 0) + 1
    return (totals[room.type] ?? 0) > 1
      ? `${room.type} ${seen[room.type]}`
      : room.type
  })
}

/** A row of buttons, one per binnenruimte type, that add/open that type when clicked. */
function BinnenruimteTypeButtons({
  types,
  openType,
  onAdd,
}: {
  types: BinnenruimteType[]
  openType?: BinnenruimteType
  onAdd: (type: BinnenruimteType) => void
}) {
  return (
    <Row wrap>
      {types.map((type) => {
        const isOpen = type === openType
        return (
          <Button
            key={type}
            type="button"
            variant={isOpen ? "primary" : "secondary"}
            icon={isOpen ? CheckMarkIcon : PlusIcon}
            iconBefore
            onClick={() => onAdd(type)}
          >
            {type}
          </Button>
        )
      })}
    </Row>
  )
}

type Props = {
  onNextStep: () => void
}

export function StepBinnenruimtes({ onNextStep }: Props) {
  const { control } = useFormContext<GebruikersinvoerFormValues>()
  const { fields, append, remove } = useFieldArray({
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
  // The room currently shown as an editable form, as opposed to a row in the list below.
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  // Whether that open room has never been saved yet. Clicking another type while it's still
  // an unsaved draft replaces it, so repeatedly clicking a type button can't pile up unsaved
  // rooms; only rooms that were actually saved end up in the list.
  const [isDraftOpen, setIsDraftOpen] = useState(false)
  const openType = openIndex !== null ? fields[openIndex]?.type : undefined

  const handleAdd = (type: BinnenruimteType) => {
    const replacesDraft = openIndex !== null && isDraftOpen
    if (replacesDraft) {
      remove(openIndex)
    }
    append(emptyBinnenruimte(type))
    setOpenIndex(replacesDraft ? fields.length - 1 : fields.length)
    setIsDraftOpen(true)
  }

  const handleEdit = (index: number) => {
    setOpenIndex(index)
    setIsDraftOpen(false)
  }

  const handleSave = () => {
    setOpenIndex(null)
    setIsDraftOpen(false)
  }

  const handleRemove = (index: number) => {
    remove(index)
    setOpenIndex((current) => {
      if (current === null || index === current) return null
      return index < current ? current - 1 : current
    })
  }

  return (
    <Grid gapVertical="large" className="align-items-end padding-Inline-start">
      <Grid.Cell span="all">
        <Column gap="large">
          <Column gap="small">
            <Heading level={2}>Binnenruimtes</Heading>
            <Paragraph>
              Uit welke binnenruimtes bestaat de woning? Vul de oppervlakte per
              ruimte in. Doe dit voor alle binnenruimtes in de woning. Alle
              ruimtes in de woning tellen mee in de puntentelling.
            </Paragraph>
          </Column>

          <BinnenruimteTable
            rooms={rooms}
            roomLabels={roomLabels}
            openIndex={openIndex}
            onEdit={handleEdit}
            onRemove={handleRemove}
          />

          <Column gap="small">
            <Heading level={3}>Kies een binnenruimte</Heading>
            <Paragraph className="ams-mb-m">
              Welke binnenruimtes zijn er voor eigen gebruik? Vul ze één voor
              één in.
            </Paragraph>
            <BinnenruimteTypeButtons
              types={BINNENRUIMTE_TYPES}
              openType={openType}
              onAdd={handleAdd}
            />
          </Column>

          <Accordion headingLevel={3}>
            <Accordion.Section label="Andere binnenruimtes">
              <BinnenruimteTypeButtons
                types={ANDERE_BINNENRUIMTE_TYPES}
                openType={openType}
                onAdd={handleAdd}
              />
            </Accordion.Section>
            <Accordion.Section label="Keuken, bad, douche of wastafel in andere ruimte">
              <BinnenruimteTypeButtons
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
            onSave={handleSave}
          />
        </Grid.Cell>
      )}

      <Grid.Cell span="all" appearance="transparent">
        <StepActions onNextStep={onNextStep} />
      </Grid.Cell>
    </Grid>
  )
}

export default StepBinnenruimtes
