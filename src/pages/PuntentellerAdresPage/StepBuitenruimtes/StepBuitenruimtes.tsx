import { useFieldArray, useFormContext, useWatch } from "react-hook-form"
import {
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
import { BuitenruimteFields } from "./BuitenruimteFields"

const BUITENRUIMTE_TYPES: BuitenruimteType[] = [
  "Balkon",
  "Dakterras",
  "Voortuin / zijtuin",
  "Achtertuin",
  "Loggia",
]

const emptyBuitenruimte = (type: BuitenruimteType): Buitenruimte => ({
  type,
  lengte: null,
  breedte: null,
  oppervlakte: null,
  aantal_adressen: 1,
})

type Props = {
  onNextStep: () => void
}

export function StepBuitenruimtes({ onNextStep }: Props) {
  const { control } = useFormContext<GebruikersinvoerFormValues>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: "buitenruimtes",
  })
  // useFieldArray's fields only reflect each room's values as of the last append/remove, not
  // live edits (e.g. oppervlakte), so the table needs the watched values merged in for those.
  const watchedRooms = useWatch({ control, name: "buitenruimtes" }) ?? []
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
    remove: removeRoom,
  } = useOpenRoom({
    count: fields.length,
    append,
    remove,
  })
  const openType = openIndex !== null ? fields[openIndex]?.type : undefined

  return (
    <>
      <Grid.Cell span="all">
        <Column gap="large">
          <Heading level={2}>Buitenruimtes</Heading>
          <Paragraph>
            Dit deel gaat over ruimtes buiten de woning, zoals een balkon of een
            tuin, die de huurder mag gebruiken. Dat kunnen ruimtes zijn voor
            eigen gebruik, maar ook ruimtes die worden gedeeld op een ander
            adres. Zoals een gedeelde tuin of een gedeelde parkeergelegenheid.
          </Paragraph>

          <RuimteTable
            soort="Buitenruimte"
            rooms={rooms}
            roomLabels={roomLabels}
            openIndex={openIndex}
            onEdit={edit}
            onRemove={removeRoom}
          />

          <Column gap="small">
            <Heading level={3}>Kies een buitenruimte</Heading>
            <Paragraph className="ams-mb-m">
              Welke buitenruimtes zijn er voor eigen of gedeeld gebruik? Vul ze
              een voor een in.
            </Paragraph>
            <RuimteTypeButtons
              types={BUITENRUIMTE_TYPES}
              openType={openType}
              onAdd={(type) => add(emptyBuitenruimte(type))}
            />
          </Column>
        </Column>
      </Grid.Cell>

      {openIndex !== null && (
        <Grid.Cell span="all">
          <Heading level={2} className="ams-mb-m">
            {roomLabels[openIndex]}
          </Heading>
          <BuitenruimteFields
            index={openIndex}
            label={roomLabels[openIndex]}
            onSave={save}
          />
        </Grid.Cell>
      )}

      <Grid.Cell span="all" appearance="transparent">
        <StepActions onNextStep={onNextStep} />
      </Grid.Cell>
    </>
  )
}

export default StepBuitenruimtes
