import { Heading, Icon, Row } from "@amsterdam/design-system-react"
import { ErrorIcon, SuccessIcon } from "@amsterdam/design-system-react-icons"

import { Description, Divider, Tag } from "@/components"
import { createPermitDescriptionData } from "../data/createPermitDescriptionData"
import { isDateValid } from "../data/utils"

type Props = {
  permit: PermitDecos
  showDivider?: boolean
}

export function DecosPermit({ permit, showDivider = true }: Props) {
  const { permit_type, permit_granted } = permit
  const isGranted = permit_granted === "GRANTED"
  const hasValidDate = isDateValid(permit)
  const isValid = isGranted && hasValidDate
  const data = createPermitDescriptionData(permit)
  const hasExpired = isGranted && !hasValidDate

  return (
    <>
      <Row
        wrap
        gap="small"
        alignVertical="center"
        align="between"
        className="mb-3"
      >
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Icon
            svg={isValid ? SuccessIcon : ErrorIcon}
            size="heading-3"
            style={{
              color: isValid
                ? "var(--ams-color-feedback-success)"
                : "var(--ams-color-feedback-error)",
            }}
          />
          <Heading level={3}>{permit_type}</Heading>
        </div>
        {hasExpired && <Tag name="Verlopen" color="red" />}
      </Row>
      <Description termsWidth="narrow" data={data} />
      {showDivider && <Divider />}
    </>
  )
}

export default DecosPermit
