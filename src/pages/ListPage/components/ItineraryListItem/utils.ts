export function formatAddress(address?: Address): string {
  if (!address) return ""

  let result = `${address.street_name} ${address.number}`

  if (address.suffix || address.suffix_letter) {
    result = `${result}-${address.suffix}${address.suffix_letter}`
  }

  return result.trim()
}

export function getWorkflowName(workflow?: Workflow): string | undefined {
  if (!workflow) return undefined
  if (typeof workflow === "string") return workflow
  return workflow.state?.name
}
