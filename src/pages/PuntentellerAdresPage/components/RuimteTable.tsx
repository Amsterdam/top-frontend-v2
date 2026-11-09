import {
  Button,
  Column,
  Dialog,
  Heading,
  IconButton,
  Row,
  Table,
} from "@amsterdam/design-system-react"
import { DeleteIcon, PencilIcon } from "@amsterdam/design-system-react-icons"
import { ConfirmDialog } from "@/components"
import { useMediaQuery, BREAKPOINTS } from "@/hooks"
import { formatM2, toNumber } from "../helpers/oppervlakte"

type Props = {
  /** "Binnenruimte" or "Buitenruimte", used in the heading and the delete dialog. */
  soort: string
  rooms: { id: string; oppervlakte: number | null }[]
  roomLabels: string[]
  openIndex: number | null
  onEdit: (index: number) => void
  onRemove: (index: number) => void
}

/** The list of already-saved binnen- or buitenruimtes, excluding the one currently open for editing. */
export function RuimteTable({
  soort,
  rooms,
  roomLabels,
  openIndex,
  onEdit,
  onRemove,
}: Props) {
  const isMobile = useMediaQuery(BREAKPOINTS.sm)

  if (!rooms.some((_, index) => index !== openIndex)) return null

  // The total of the listed rooms, so without the one open for editing. Rooms without an
  // oppervlakte (an overloop, a parkeerruimte) don't count.
  const oppervlaktes = rooms
    .filter((_, index) => index !== openIndex)
    .map((room) => toNumber(room.oppervlakte))
    .filter((oppervlakte) => oppervlakte !== null)
  const total =
    oppervlaktes.length > 0
      ? Math.round(oppervlaktes.reduce((sum, m2) => sum + m2, 0) * 100) / 100
      : null
  const heading = `Toegevoegde ${soort.toLowerCase()}s${total === null ? "" : ` (${formatM2(total)})`}`

  return (
    <Column gap="small">
      <Heading level={3}>{heading}</Heading>
      <Table className="table--borderless">
        <Table.Caption className="ams-visually-hidden">{heading}</Table.Caption>
        <Table.Body>
          {rooms.map((room, index) => {
            if (index === openIndex) return null

            const dialogId = `wissen-${soort.toLowerCase()}-${room.id}`
            return (
              <Table.Row key={room.id}>
                <Table.Cell className="bullet-cell">
                  {roomLabels[index]}
                  {room.oppervlakte != null && ` (${room.oppervlakte} m²)`}
                </Table.Cell>
                <Table.Cell>
                  <Row>
                    {isMobile ? (
                      <IconButton
                        label="Wijzigen"
                        svg={PencilIcon}
                        onClick={() => onEdit(index)}
                      />
                    ) : (
                      <Button
                        type="button"
                        variant="tertiary"
                        icon={PencilIcon}
                        iconBefore
                        onClick={() => onEdit(index)}
                      >
                        Wijzigen
                      </Button>
                    )}
                    {isMobile ? (
                      <IconButton
                        label="Wissen"
                        svg={DeleteIcon}
                        onClick={() => Dialog.open(`#${dialogId}`)}
                      />
                    ) : (
                      <Button
                        type="button"
                        variant="tertiary"
                        icon={DeleteIcon}
                        iconBefore
                        onClick={() => Dialog.open(`#${dialogId}`)}
                      >
                        Wissen
                      </Button>
                    )}
                  </Row>
                  <ConfirmDialog
                    id={dialogId}
                    title={`${soort} verwijderen`}
                    content={
                      <span>
                        Weet je zeker dat je{" "}
                        <strong>{roomLabels[index]}</strong> wilt verwijderen?
                      </span>
                    }
                    onOk={() => onRemove(index)}
                    onOkText="Verwijderen"
                  />
                </Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
    </Column>
  )
}
