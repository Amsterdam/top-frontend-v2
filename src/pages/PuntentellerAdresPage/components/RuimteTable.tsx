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

  return (
    <Column gap="small">
      <Heading level={3}>Toegevoegde {soort.toLowerCase()}s</Heading>
      <Table className="table--borderless">
        <Table.Caption className="ams-visually-hidden">
          Toegevoegde {soort.toLowerCase()}s
        </Table.Caption>
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
