import type { Resident } from "../../types"
import { getGenderColor } from "../../utils/getGenderColor"
import styles from "./GenderHeading.module.css"

export function GenderHeading({
  resident,
  title,
}: {
  resident: Resident
  title: string
}) {
  const genderColor = getGenderColor(resident)
  return (
    <div
      className={styles.genderHeading}
      style={{ color: genderColor, borderBottomColor: genderColor }}
    >
      <strong style={{ color: genderColor }}>{title}</strong>
    </div>
  )
}
