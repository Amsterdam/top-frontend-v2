export const APP_PERMISSIONS = {
  manageSettings: "planner.manage_settings",
} as const

export type AppPermission =
  (typeof APP_PERMISSIONS)[keyof typeof APP_PERMISSIONS]

export type PermissionRequirement =
  AppPermission | readonly AppPermission[] | undefined

export const hasRequiredPermissions = (
  grantedPermissions: readonly string[] | undefined,
  requiredPermissions?: PermissionRequirement,
) => {
  if (!requiredPermissions) {
    return true
  }

  if (!grantedPermissions?.length) {
    return false
  }

  const requiredList = Array.isArray(requiredPermissions)
    ? requiredPermissions
    : [requiredPermissions]

  return requiredList.every((permission) =>
    grantedPermissions.includes(permission),
  )
}
