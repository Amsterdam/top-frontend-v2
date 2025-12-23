import {
  Button,
  Column,
  Heading,
  Paragraph,
  Row,
} from "@amsterdam/design-system-react"
import styles from "./ListItem.module.css"
import { cleanAddress } from "./utils"
import { TrashBinIcon } from "@amsterdam/design-system-react-icons"
import { Tag, StatusTag, PriorityTag, Note } from "@/components"

type ExtendedCaseData = {
  address: {
    full_address: string
    postal_code: string
  }
  workflows: {
    state: { name: string | null }
  }[]
  schedules?: {
    priority?: { weight: number }
  }[]
  reason?: components["schemas"]["CaseReason"]
  project?: components["schemas"]["CaseProject"]
  tags?: components["schemas"]["CaseTag"][]
}

type ExtendedCase = components["schemas"]["ItineraryItem"]["case"] & {
  data?: ExtendedCaseData
}

export type Item = components["schemas"]["ItineraryItem"] & {
  case?: ExtendedCase
}

export function ListItem({ item }: { item: Item }) {
  const caseData = item.case?.data
  const address = caseData?.address
  const workflows = caseData?.workflows
  const statusName =
    workflows && workflows.length > 0 ? workflows[0]?.state.name : undefined
  const schedules = caseData?.schedules
  const priority =
    schedules && schedules.length > 0 ? schedules[0]?.priority : undefined
  const notes = item?.visits[0]?.personal_notes

  return (
    <Column className={styles.card} gap="small">
      <Row align="between">
        <Column gap="x-small" alignHorizontal="start">
          <Heading level={3}>{cleanAddress(address?.full_address)}</Heading>
          <Paragraph>{address?.postal_code}</Paragraph>
          <Paragraph>{caseData?.reason?.name}</Paragraph>
          <Paragraph>{caseData?.project?.name}</Paragraph>
        </Column>
        <Column alignHorizontal="end">
          <Button>Bezoek</Button>
          <Button icon={TrashBinIcon} variant="secondary" />
        </Column>
      </Row>
      <Row>
        <StatusTag statusName={statusName} />
        <PriorityTag priority={priority} />

        {caseData?.tags?.map((tag) => (
          <Tag key={tag.id} color="green" name={tag.name} />
        ))}
      </Row>
      <Note note={notes} />
    </Column>
  )
}

export default ListItem
