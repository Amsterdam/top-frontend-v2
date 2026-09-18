import { useState } from "react"
import { useFieldArray, useFormContext } from "react-hook-form"
import {
  Button,
  Column,
  Dialog,
  Grid,
  Heading,
  Paragraph,
  Row,
  Table,
} from "@amsterdam/design-system-react"
import {
  CheckMarkIcon,
  DeleteIcon,
  PencilIcon,
  PlusIcon,
} from "@amsterdam/design-system-react-icons"
import { ConfirmDialog } from "@/components"
import { StepActions } from "../components/StepActions"
import { BinnenruimteFields } from "./BinnenruimteFields"

const BINNENRUIMTE_TYPES: BinnenruimteType[] = [
  "Woonkamer",
  "Keuken",
  "Woonkamer met open keuken",
  "Slaapkamer",
  "Badkamer",
  "Toiletruimte",
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

type Props = {
  onNextStep: () => void
}

export function StepBinnenruimtes({ onNextStep }: Props) {
  const { control } = useFormContext<GebruikersinvoerFormValues>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: "binnenruimtes",
  })
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
              Uit welke binnenruimtes bestaat de woning? Vul de oppervlakte
              per ruimte in. Doe dit voor alle binnenruimtes in de woning.
              Alle ruimtes in de woning tellen mee in de puntentelling.
            </Paragraph>
          </Column>

          {fields.some((_, index) => index !== openIndex) && (
            <Column gap="small">
              <Heading level={3}>Toegevoegde binnenruimtes</Heading>
              <Table className="table--borderless">
                <Table.Caption className="ams-visually-hidden">
                  Toegevoegde binnenruimtes
                </Table.Caption>
                <Table.Body>
                  {fields.map((field, index) => {
                    if (index === openIndex) return null

                    const dialogId = `wissen-binnenruimte-${field.id}`
                    return (
                      <Table.Row key={field.id}>
                        <Table.Cell className="bullet-cell">
                          {roomLabels[index]}
                        </Table.Cell>
                        <Table.Cell>
                          <Row gap="small">
                            <Button
                              type="button"
                              variant="tertiary"
                              icon={PencilIcon}
                              iconBefore
                              onClick={() => handleEdit(index)}
                            >
                              Wijzigen
                            </Button>
                            <Button
                              type="button"
                              variant="tertiary"
                              icon={DeleteIcon}
                              iconBefore
                              onClick={() => Dialog.open(`#${dialogId}`)}
                            >
                              Wissen
                            </Button>
                          </Row>
                          <ConfirmDialog
                            id={dialogId}
                            title="Binnenruimte verwijderen"
                            content={
                              <span>
                                Weet je zeker dat je{" "}
                                <strong>{roomLabels[index]}</strong> wilt
                                verwijderen?
                              </span>
                            }
                            onOk={() => handleRemove(index)}
                            onOkText="Verwijderen"
                          />
                        </Table.Cell>
                      </Table.Row>
                    )
                  })}
                </Table.Body>
              </Table>
            </Column>
          )}

          <Column gap="small">
            <Heading level={3}>Kies een binnenruimte</Heading>
            <Paragraph className="ams-mb-m">
              Welke binnenruimtes zijn er voor eigen gebruik? Vul ze één voor
              één in.
            </Paragraph>
            <Row wrap>
              {BINNENRUIMTE_TYPES.map((type) => {
                const isOpen = type === openType
                return (
                  <Button
                    key={type}
                    type="button"
                    variant={isOpen ? "primary" : "secondary"}
                    icon={isOpen ? CheckMarkIcon : PlusIcon}
                    iconBefore
                    onClick={() => handleAdd(type)}
                  >
                    {type}
                  </Button>
                )
              })}
            </Row>
          </Column>
        </Column>
      </Grid.Cell>

      {openIndex !== null && (
        <Grid.Cell span="all">
          <Heading level={2} className="ams-mb-m">{roomLabels[openIndex]}</Heading>
          <BinnenruimteFields
            index={openIndex}
            label={roomLabels[openIndex]}
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
