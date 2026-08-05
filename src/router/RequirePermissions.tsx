import { Navigate, Outlet } from "react-router"
import { usePermissions } from "@/api/hooks"
import { AmsterdamCrossSpinner } from "@/components"
import {
  hasRequiredPermissions,
  type PermissionRequirement,
} from "@/shared/permissions"

type RequirePermissionsProps = {
  requiredPermissions: PermissionRequirement
}

export default function RequirePermissions({
  requiredPermissions,
}: RequirePermissionsProps) {
  const { data: permissions, isPending } = usePermissions()
  const hasAccess = hasRequiredPermissions(permissions, requiredPermissions)

  if (isPending) {
    return <AmsterdamCrossSpinner />
  }

  if (!hasAccess) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}