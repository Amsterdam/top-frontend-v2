import { describe, expect, it } from "vitest"
import { APP_PERMISSIONS, hasRequiredPermissions } from "../permissions"

describe("hasRequiredPermissions", () => {
  it("returns true when no permission is required", () => {
    expect(hasRequiredPermissions(undefined, undefined)).toBe(true)
  })

  it("returns true when the required permission is present", () => {
    expect(
      hasRequiredPermissions(
        [APP_PERMISSIONS.manageSettings],
        APP_PERMISSIONS.manageSettings,
      ),
    ).toBe(true)
  })

  it("returns false when the required permission is missing", () => {
    expect(
      hasRequiredPermissions(["view_lists"], APP_PERMISSIONS.manageSettings),
    ).toBe(false)
  })

  it("requires every permission when multiple are configured", () => {
    const secondPermission =
      "planner.view_teamsettings" as typeof APP_PERMISSIONS.manageSettings

    expect(
      hasRequiredPermissions(
        [APP_PERMISSIONS.manageSettings, secondPermission],
        [APP_PERMISSIONS.manageSettings, secondPermission],
      ),
    ).toBe(true)

    expect(
      hasRequiredPermissions(
        [APP_PERMISSIONS.manageSettings],
        [APP_PERMISSIONS.manageSettings, secondPermission],
      ),
    ).toBe(false)
  })
})
