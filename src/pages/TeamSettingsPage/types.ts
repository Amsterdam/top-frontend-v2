export type TeamSettingsOptions = {
  reasons?: components["schemas"]["CaseReason"][]
  scheduleTypes?: TeamScheduleTypes
  stateTypes?: components["schemas"]["CaseStateType"][]
  caseProjects?: components["schemas"]["CaseProject"][]
  subjects?: components["schemas"]["CaseSubject"][]
  tags?: components["schemas"]["CaseTag"][]
  housingCorporations?: components["schemas"]["HousingCorporation"][]
  districts?: District[]
}
