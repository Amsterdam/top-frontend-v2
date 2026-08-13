import { renderStatusBadge } from "@/shared"
import { getPermitStatusBadgeVariant } from "../data/getPermitStatusBadgeVariant"

export function PermitBadge({ status }: { status: string }) {
  return renderStatusBadge(status, getPermitStatusBadgeVariant(status))
}
