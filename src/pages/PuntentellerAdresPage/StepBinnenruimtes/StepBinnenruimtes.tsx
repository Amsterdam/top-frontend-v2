import { useState } from "react"
import { useFieldArray, useFormContext } from "react-hook-form"
import {
  Button,
  Grid,
  Heading,
  Paragraph,
  Row,
  UnorderedList,
} from "@amsterdam/design-system-react"
import {
  DeleteIcon,
  PencilIcon,
  PlusIcon,
} from "@amsterdam/design-system-react-icons"
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

  const handleAdd = (type: BinnenruimteType) => {
    append(emptyBinnenruimte(type))
    setOpenIndex(fields.length)
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
      <Grid.Cell span="all" appearance="transparent">
        <Heading level={2}>Binnenruimtes</Heading>
        <Paragraph>
          Uit welke binnenruimtes bestaat de woning? Vul de oppervlakte per
          ruimte in. Doe dit voor alle binnenruimtes in de woning. Alle ruimtes
          in de woning tellen mee in de puntentelling.
        </Paragraph>
      </Grid.Cell>

      {fields.some((_, index) => index !== openIndex) && (
        <Grid.Cell span="all" appearance="transparent">
          <Heading level={3}>Toegevoegde binnenruimtes</Heading>
          <UnorderedList>
            {fields.map(
              (field, index) =>
                index !== openIndex && (
                  <UnorderedList.Item key={field.id}>
                    <Row alignVertical="center">
                      {roomLabels[index]}
                      <Button
                        type="button"
                        variant="tertiary"
                        icon={PencilIcon}
                        iconBefore
                        onClick={() => setOpenIndex(index)}
                      >
                        Wijzigen
                      </Button>
                      <Button
                        type="button"
                        variant="tertiary"
                        icon={DeleteIcon}
                        iconBefore
                        onClick={() => handleRemove(index)}
                      >
                        Wissen
                      </Button>
                    </Row>
                  </UnorderedList.Item>
                ),
            )}
          </UnorderedList>
        </Grid.Cell>
      )}

      <Grid.Cell span="all" appearance="transparent">
        <Heading level={3}>Kies een binnenruimte</Heading>
        <Paragraph className="ams-mb-m">
          Welke binnenruimtes zijn er voor eigen gebruik? Vul ze één voor één
          in.
        </Paragraph>
        <Row wrap>
          {BINNENRUIMTE_TYPES.map((type) => (
            <Button
              key={type}
              type="button"
              variant="secondary"
              icon={PlusIcon}
              iconBefore
              onClick={() => handleAdd(type)}
            >
              {type}
            </Button>
          ))}
        </Row>
      </Grid.Cell>

      {openIndex !== null && (
        <Grid.Cell span="all" appearance="transparent">
          <Heading level={3}>{roomLabels[openIndex]}</Heading>
          <BinnenruimteFields
            index={openIndex}
            label={roomLabels[openIndex]}
            onSave={() => setOpenIndex(null)}
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
