import { Avatar, Row } from "@amsterdam/design-system-react"
import { WarningIcon } from "@amsterdam/design-system-react-icons"
import type { Resident } from "../../types"
import { formatName } from "../../utils/formatting"
import { Tag } from "@/components"

export function PersonHeader({ resident }: { resident: Resident }) {
  const genderCode = resident?.geslacht?.code

  const avatarColor =
    genderCode === "M" ? "azure" : genderCode === "V" ? "magenta" : "green"

  const isDeceased = Boolean(resident?.overlijden?.datum?.langFormaat)

  const isMailAddress =
    resident?.verblijfplaats?.functieAdres?.omschrijving === "briefadres"

  return (
    <Row alignVertical="center" wrap>
      <Avatar label="" color={avatarColor} />
      <strong>
        {formatName(resident?.naam)}
        {isDeceased && " †"}
      </strong>
      {isMailAddress && (
        <Tag name="briefadres" color="orange" icon={WarningIcon} />
      )}
    </Row>
  )
}

export default PersonHeader
