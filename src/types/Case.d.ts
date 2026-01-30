type Workflow =
  | string
  | {
      state?: {
        name?: string
      }
    }

type Value = string | number | boolean | null | JSX.Element

type Case = {
  id: number
  address: Address
  workflows?: Workflow[]
  schedules?: {
    priority?: { weight: number }
  }[]
  reason?: components["schemas"]["CaseReason"]
  project?: components["schemas"]["CaseProject"]
  tags?: components["schemas"]["CaseTag"][]
  subjects?: components["schemas"]["CaseSubject"][]
  distance?: number
  bag_data?: Record<string, Value>
}
