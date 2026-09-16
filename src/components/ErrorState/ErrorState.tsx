import {
  Button,
  Heading,
  Icon,
  type IconProps,
  Paragraph,
} from "@amsterdam/design-system-react"
import { FaceSadIcon } from "@amsterdam/design-system-react-icons"

type ErrorStateProps = {
  title: string
  description: string
  actionLabel: string
  actionIcon: IconProps["svg"]
  onAction: () => void
}

export function ErrorState({
  title,
  description,
  actionLabel,
  actionIcon,
  onAction,
}: ErrorStateProps) {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <Icon
        svg={FaceSadIcon}
        aria-hidden="true"
        style={{ fontSize: "48px" }}
        className="ams-mb-s animate-wobble-every-5s"
      />
      <Heading level={1} className="ams-mb-m">
        {title}
      </Heading>
      <Paragraph className="ams-mb-xl">{description}</Paragraph>
      <Button onClick={onAction} icon={actionIcon} iconBefore>
        {actionLabel}
      </Button>
    </div>
  )
}

export default ErrorState
