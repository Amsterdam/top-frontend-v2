import { Fragment, type ReactNode } from "react"
import { DescriptionList } from "@amsterdam/design-system-react"

export type DescriptionItem = {
  label: ReactNode
  value: ReactNode | null | undefined
}

type Props = {
  data: DescriptionItem[]
  termsWidth?: "narrow" | "medium" | "wide"
  className?: string
}

export function Description({ data, termsWidth, className }: Props) {
  return (
    <DescriptionList termsWidth={termsWidth} className={className}>
      {data.map((item, index) => {
        if (item.value === null || item.value === undefined) {
          return null
        }
        return (
          <Fragment key={`fragment-${index}`}>
            <DescriptionList.Term key={`term-${index}`}>
              {item.label}
            </DescriptionList.Term>
            <DescriptionList.Description key={`description-${index}`}>
              {item.value}
            </DescriptionList.Description>
          </Fragment>
        )
      })}
    </DescriptionList>
  )
}
