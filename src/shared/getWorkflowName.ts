export function getWorkflowName(
  workflows?: Workflow[] | string[],
): string | undefined {
  if (!workflows || workflows.length === 0) return undefined

  const workflow = workflows[0]

  if (typeof workflow === "string") return workflow

  return workflow.state?.name
}
