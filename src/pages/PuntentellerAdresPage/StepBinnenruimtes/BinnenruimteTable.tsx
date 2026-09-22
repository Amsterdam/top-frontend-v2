import {
  Button,
  Column,
  Dialog,
  Heading,
  Row,
  Table,
} from "@amsterdam/design-system-react"
import { DeleteIcon, PencilIcon } from "@amsterdam/design-system-react-icons"
import { ConfirmDialog } from "@/components"

type Props = {
  rooms: (Binnenruimte & { id: string })[]
  roomLabels: string[]
  openIndex: number | null
  onEdit: (index: number) => void
  onRemove: (index: number) => void
}

/** The list of already-saved binnenruimtes, excluding the one currently open for editing. */
export function BinnenruimteTable({
  rooms,
  roomLabels,
  openIndex,
  onEdit,
  onRemove,
}: Props) {
  if (!rooms.some((_, index) => index !== openIndex)) return null

  return (
    <Column gap="small">
      <Heading level={3}>Toegevoegde binnenruimtes</Heading>
      <Table className="table--borderless">
        <Table.Caption className="ams-visually-hidden">
          Toegevoegde binnenruimtes
        </Table.Caption>
        <Table.Body>
          {rooms.map((room, index) => {
            if (index === openIndex) return null

            const dialogId = `wissen-binnenruimte-${room.id}`
            return (
              <Table.Row key={room.id}>
                <Table.Cell className="bullet-cell">
                  {roomLabels[index]}
                  {room.oppervlakte != null && ` (${room.oppervlakte} m²)`}
                </Table.Cell>
                <Table.Cell>
                  <Row gap="small">
                    <Button
                      type="button"
                      variant="tertiary"
                      icon={PencilIcon}
                      iconBefore
                      onClick={() => onEdit(index)}
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
