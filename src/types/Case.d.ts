type Theme = components["schemas"]["TeamSettingsTheme"]

type TeamMember = {
  id: number
  user: {
    id: string
    email: string
    username: string
    first_name: string
    last_name: string
    full_name: string
    team_settings: unknown[]
  }
}

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
  theme?: Theme
  teams?: TeamMember[][]
}
