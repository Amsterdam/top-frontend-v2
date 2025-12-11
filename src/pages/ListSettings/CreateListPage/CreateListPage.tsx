import {
  Column,
  Heading,
} from "@amsterdam/design-system-react"
import { useParams } from "react-router"
import {  } from "@amsterdam/ee-ads-rhf"
import { useThemeSettings } from "@/api/hooks"

export default function CreateListPage() {
  const { themeId } = useParams<{ themeId: string }>()
  const { data } = useThemeSettings(themeId)
  console.log("Theme data:", data)
  return (
    <>
      <Heading level={1}>Genereer looplijst</Heading>
      
      <Column gap="large" alignHorizontal="start">
        
      </Column>
    </>
  )
}
