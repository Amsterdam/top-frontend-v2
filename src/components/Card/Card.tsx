import { type ReactNode } from "react"
import {
  Column,
  Heading,
  Icon,
  Row,
  type IconProps,
} from "@amsterdam/design-system-react"

import styles from "./Card.module.css"

type Props = {
  title: string | ReactNode
  children: ReactNode
  actions?: ReactNode
  className?: string
  icon?: IconProps["svg"]
}

export function Card({ title, children, actions, className, icon }: Props) {
  return (
    <Column className={`${styles.card} ${className ?? ""}`}>
      <Row align="between" gap="small" wrap>
        <Row gap="small">
          {icon && <Icon svg={icon} size="heading-3" />}
          <Heading level={3}>{title}</Heading>
        </Row>
        {actions && <Row align="end">{actions}</Row>}
      </Row>
      <div>{children}</div>
    </Column>
  )
}
