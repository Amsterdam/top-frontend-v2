import { Heading, Icon, Row } from "@amsterdam/design-system-react"
import { ErrorIcon, SuccessIcon } from "@amsterdam/design-system-react-icons"

import { Description } from "@/components"
import { createPermitDescriptionData } from "../data/createPermitDescriptionData"
import { isValidPermit } from "../data/utils"
import { PermitBadge } from "./PermitBadge"

type Props = {
  permit: Permit
}

export function Permit({ permit }: Props) {
  const isValid = isValidPermit(permit)
  const data = createPermitDescriptionData(permit)

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
          <Heading level={3}>{permit.product || ""}</Heading>
        </div>
        <PermitBadge status={permit.status} />
      </Row>
      <Description termsWidth="narrow" data={data} />
    </>
  )
}

export default Permit
