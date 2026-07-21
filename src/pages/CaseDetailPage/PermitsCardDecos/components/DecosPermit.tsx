import { Badge, Heading, Icon, Row } from "@amsterdam/design-system-react"
import { ErrorIcon, SuccessIcon } from "@amsterdam/design-system-react-icons"

import { Description } from "@/components"
import { createPermitDescriptionData } from "../data/createPermitDescriptionData"
import { isDateValid } from "../data/utils"

type Props = {
  permit: PermitDecos
  showDivider?: boolean
}

export function DecosPermit({ permit }: Props) {
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
        className="ams-mb-s"
      >
        <Row wrap gap="small" alignVertical="center">
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
        </Row>
        {hasExpired && <Badge label="Verlopen" color="red" />}
      </Row>
      <Description termsWidth="narrow" data={data} />
    </>
  )
}

export default DecosPermit
