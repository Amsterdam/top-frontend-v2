const itineraryToClipboardText = (caseItem?: Case) => {
  if (!caseItem) return ""
  const { address, workflows, reason, project } = caseItem
  const state = workflows && workflows.length > 0 ? workflows[0] : undefined
  return `${address.full_address} ${state} ${reason?.name} ${project?.name ?? "r"}`
}

export default itineraryToClipboardText
