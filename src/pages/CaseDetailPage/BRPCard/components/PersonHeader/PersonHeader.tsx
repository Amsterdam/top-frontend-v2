import { Avatar, Row } from "@amsterdam/design-system-react"
import type { Resident } from "../../types"
import { formatName } from "../../utils/formatting"

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
              : "green"
        }
      />
      <strong>
        {formatName(resident?.naam)}
        {resident.overlijden?.datum?.langFormaat ? " †" : ""}
      </strong>
    </Row>
  )
}

export default PersonHeader
