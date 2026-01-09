import {
  Button,
  Column,
  Heading,
  Paragraph,
  Row,
} from "@amsterdam/design-system-react"
import { formatAddress, getSchedulePriority, getWorkflowName } from "@/shared"
import { StatusTag, PriorityTag } from "../tags"
import styles from "./SmallCaseCard.module.css"

type Props = {
  caseData: Case
  onRemove: () => void
}

export function SmallCaseCard({ caseData, onRemove }: Props) {
  const statusName = getWorkflowName(caseData?.workflows)
  const priority = getSchedulePriority(caseData?.schedules)
  return (
    <Column gap="small" className={styles.card}>
      <Heading level={3}>{formatAddress(caseData.address, true)}</Heading>
      <Paragraph>{`Zaak ID: ${caseData.id}`}</Paragraph>

      <Paragraph>{caseData?.reason?.name}</Paragraph>

      <Paragraph>{caseData?.project?.name}</Paragraph>
      <Row wrap>
        <StatusTag statusName={statusName} />
        <PriorityTag priority={priority} />
      </Row>

      <Button variant="secondary" onClick={onRemove} className="mt-3">
        Verwijder startadres
      </Button>
    </Column>
  )
}
