import { Heading, Icon, Row } from "@amsterdam/design-system-react"
import { ErrorIcon, SuccessIcon } from "@amsterdam/design-system-react-icons"
import { Description, Divider } from "@/components"
import { createPermitDescriptionData } from "../createPermitDescriptionData"
import { isValidPermit } from "../utils"
import { PermitTag } from "../PermitTag/PermitTag"

export function Permit({ permit }: { permit: Permit }) {
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
        <PermitTag status={permit.status} />
      </Row>
      <Description termsWidth="narrow" data={data} />
      <Divider />
    </>
  )
}

export default Permit
