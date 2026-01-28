import { DescriptionList } from "@amsterdam/design-system-react"
import type { ReactNode } from "react"

type DescriptionItem = {
  label: ReactNode
  value: ReactNode | null | undefined
}

type Props = {
  data: DescriptionItem[]
  termsWidth?: "narrow" | "medium" | "wide"
}

export function Description({ data, termsWidth }: Props) {
  console.log({ data })
  return (
    <DescriptionList termsWidth={termsWidth}>
      {data.map((item, index) => {
        if (item.value === null || item.value === undefined) {
          return null
        }
        return (
          <>
            <DescriptionList.Term key={`term-${index}`}>
              {item.label}
            </DescriptionList.Term>
            <DescriptionList.Description key={`description-${index}`}>
              {item.value}
            </DescriptionList.Description>
          </>
        )
      })}
    </DescriptionList>
  )
}
