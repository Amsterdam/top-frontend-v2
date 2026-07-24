import { Icon, Row } from "@amsterdam/design-system-react"
import { ErrorIcon, SuccessIcon } from "@amsterdam/design-system-react-icons"

type Props = {
  label: string
  isValid: boolean
}

export function PermitValidityLabel({ label, isValid }: Props) {
  return (
    <Row alignVertical="start" gap="small">
      <Icon
        svg={isValid ? SuccessIcon : ErrorIcon}
        size="heading-3"
        style={{
          flexShrink: 0,
          color: isValid
            ? "var(--ams-color-feedback-success)"
            : "var(--ams-color-feedback-error)",
        }}
      />
      <strong
        style={{ flex: "1 1 0%", minWidth: 0, overflowWrap: "break-word" }}
      >
        {label || "-"}
      </strong>
    </Row>
  )
}

export default PermitValidityLabel
