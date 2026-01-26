import { Icon } from "@amsterdam/design-system-react"
import styles from "./Tag.module.css"
import type { ComponentType } from "react"

const TAG_COLORS = {
  azure: "#009de6",
  blue: "#004699",
  blueDark: "#003677",
  green: "#00a03c",
  greenDark: "#007c2e",
  grey: "#d1d1d1",
  greyDark: "#767676",
  lime: "#bed200",
  magenta: "#e50082",
  orange: "#ff9100",
  purple: "#a00078",
  red: "#ec0000",
  yellow: "#ffe600",
} as const

// Colors that require dark text for better readability
const darkTextColors: TagColor[] = ["yellow", "lime", "grey", "greyDark"]

export type TagColor = keyof typeof TAG_COLORS

type TagProps = {
  name?: string | null
  color?: TagColor
  icon?: ComponentType
}

export function Tag({ name, color = "blue", icon }: TagProps) {
  const IconComponent = icon

  const style: React.CSSProperties = {
    "--tag-color": TAG_COLORS[color],
    color: darkTextColors.includes(color)
      ? "var(--ams-color-text)"
      : TAG_COLORS[color],
  } as React.CSSProperties

  return (
    <span className={styles.tag} style={style}>
      {IconComponent && <Icon svg={IconComponent} size="heading-4" />}
      {name}
    </span>
  )
}
