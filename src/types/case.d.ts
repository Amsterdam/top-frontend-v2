type Case = {
  id: number
  address: Address
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
