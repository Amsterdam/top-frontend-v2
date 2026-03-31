import { Tag, type TagColor } from "@/components"

function getStatusColor(status: string): TagColor {
  const normalized = status.toLowerCase()

  if (normalized.includes("gereed")) {
    return "green"
  }

  if (normalized.includes("intake")) {
    return "blue"
  }

  if (normalized.includes("behandel")) {
    return "orange"
  }

  return "grey"
}

export function PermitTag({ status }: { status: string }) {
  if (!status) return null
  const color = getStatusColor(status)
  return <Tag name={status} color={color} />
}
