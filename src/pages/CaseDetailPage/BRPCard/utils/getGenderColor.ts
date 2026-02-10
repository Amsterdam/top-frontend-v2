import type { Resident } from "../types"

export function getGenderColor(resident: Resident) {
  const gender = resident?.geslacht?.code?.toLowerCase()
  const genderColor = "var(--ams-color-highlight-green)"
  if (gender === "m") return "var(--ams-color-highlight-azure)"
  if (gender === "v") return "var(--ams-color-highlight-magenta)"
  return genderColor
}
