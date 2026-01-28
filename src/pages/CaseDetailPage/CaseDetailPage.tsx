import { useCase } from "@/api/hooks"
import { Heading } from "@amsterdam/design-system-react"
import { useParams } from "react-router"

export default function CaseDetailPage() {
  const { caseId } = useParams<{ caseId: string }>()
  const [data] = useCase(caseId)
  console.log("Data:", data)
  return (
    <div>
      <Heading level={1}>Zaakdetails</Heading>
      <Heading level={2}>{caseId}</Heading>
    </div>
  )
}
