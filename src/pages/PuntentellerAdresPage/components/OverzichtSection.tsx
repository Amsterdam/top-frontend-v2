import {
  Column,
  Grid,
  Heading,
  Icon,
  Row,
  type IconProps,
} from "@amsterdam/design-system-react"
import type { ReactNode } from "react"

type Props = {
  title: string
  icon: IconProps["svg"]
  children: ReactNode
}

/** One wizard step's block in the overzicht-stap: a white Grid.Cell with the step's title. */
export function OverzichtSection({ title, icon, children }: Props) {
  return (
    <Grid.Cell span="all">
      <Column gap="large">
        <Row alignVertical="center" gap="small">
          <Icon svg={icon} size="heading-2" />
          <Heading level={2}>{title}</Heading>
        </Row>
        {children}
      </Column>
    </Grid.Cell>
  )
}
