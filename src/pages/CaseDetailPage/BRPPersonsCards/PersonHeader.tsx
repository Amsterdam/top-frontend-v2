import {
  Avatar,
  Column,
  Heading,
  Paragraph,
  Row,
} from "@amsterdam/design-system-react"
import type { Resident } from "./types"

export function PersonHeader({ resident }: { resident: Resident }) {
  return (
    <Row alignVertical="center">
      <Avatar
        label=""
        color={
          resident?.geslacht?.code === "M"
            ? "azure"
            : resident?.geslacht?.code === "V"
              ? "magenta"
              : "lime"
        }
      />
      <Column gap="none">
        <Heading level={4}>
          {resident?.naam?.volledigeNaam}
          {resident.overlijden?.datum?.langFormaat ? " †" : ""}
        </Heading>
        <Paragraph size="small">
          {resident?.leeftijd ? `${resident.leeftijd} jaar` : ""}
        </Paragraph>
      </Column>
    </Row>
  )
}

export default PersonHeader
