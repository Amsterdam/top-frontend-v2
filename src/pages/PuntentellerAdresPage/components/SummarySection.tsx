import { Heading, Icon, Row, type IconProps } from "@amsterdam/design-system-react"
import { Description } from "@/components"

type Field = {
  name: keyof GebruikersinvoerFormValues
  label: string
}

type Props = {
  title: string
  fields: readonly Field[]
  values: GebruikersinvoerFormValues
  icon?: IconProps["svg"]
}

/** Renders a read-only Description list for one wizard step's fields, for the overzicht-stap. */
export function SummarySection({ title, fields, values, icon }: Props) {
  const data = fields.map(({ name, label }) => ({
    label,
    value: values[name] as string | number | boolean | null,
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
