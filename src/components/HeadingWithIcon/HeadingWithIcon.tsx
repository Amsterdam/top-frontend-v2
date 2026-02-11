import { type ReactNode } from "react"
import { Heading, Icon, type IconProps } from "@amsterdam/design-system-react"
import styles from "./HeadingWithIcon.module.css"

type HeadingWithIconProps = {
  label: string
  svg?: IconProps["svg"]
  iconComponent?: ReactNode // Prop voor custom icon-component
  level?: 1 | 2 | 3 | 4
  highlightIcon?: boolean
}

export function HeadingWithIcon({
  label,
  svg,
  iconComponent: IconComponent, // Destructure en hernoem voor intern gebruik
  level = 3,
  highlightIcon = false,
}: HeadingWithIconProps) {
  const size = `heading-${level}` as IconProps["size"]

  return (
    <div className={styles.Wrapper}>
      {IconComponent ? (
        <div
          className={`${styles.Icon} ${highlightIcon ? styles.IconHighlight : ""}`}
        >
          {IconComponent}
        </div>
      ) : svg ? (
        <Icon
          size={size}
          className={`${styles.Icon} ${highlightIcon ? styles.IconHighlight : ""}`}
          svg={svg}
        />
      ) : null}
      <Heading level={level}>{label}</Heading>
    </div>
  )
}
