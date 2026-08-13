import { getStatusBadgeVariant, renderStatusBadge } from "@/shared"

export function PermitBadge({ status }: { status: string }) {
  return renderStatusBadge(status, getStatusBadgeVariant(status))
}
