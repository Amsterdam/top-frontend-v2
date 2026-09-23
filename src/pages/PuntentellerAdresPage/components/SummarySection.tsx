import {
  Heading,
  Icon,
  Row,
  type IconProps,
} from "@amsterdam/design-system-react"
import type { ReactNode } from "react"
import { Description } from "@/components"

type Field = {
  name: keyof GebruikersinvoerFormValues
  label: string
  /** Turns the stored value into something readable, e.g. "true" into "ja". */
  format?: (value: unknown) => ReactNode
}

type Props = {
  title: string
  fields: readonly Field[]
  values: GebruikersinvoerFormValues
  icon?: IconProps["svg"]
}

/** Renders a read-only Description list for one wizard step's fields, for the overzicht-stap. */
export function SummarySection({ title, fields, values, icon }: Props) {
  const data = fields.map(({ name, label, format }) => ({
    label,
    value: format
      ? format(values[name])
      : (values[name] as string | number | null),
  }))

  return (
    <>
      <Row alignVertical="center" gap="small" className="ams-mb-l">
        {icon && <Icon svg={icon} size="heading-3" />}
        <Heading level={3}>{title}</Heading>
      </Row>
      <Description termsWidth="wide" data={data} className="ams-mb-xl" />
    </>
  )
}
