type Workflow =
  | string
  | {
      state?: {
        name?: string
      }
    }

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
  distance?: number
}
