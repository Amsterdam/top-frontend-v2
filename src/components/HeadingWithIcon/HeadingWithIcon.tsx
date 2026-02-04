import { Heading, Icon, type IconProps } from "@amsterdam/design-system-react"
import styles from "./HeadingWithIcon.module.css"

type HeadingWithIconProps = {
  label: string
  svg?: IconProps["svg"]
  level: 1 | 2 | 3 | 4
}

export function HeadingWithIcon({ label, svg, level }: HeadingWithIconProps) {
  const size = `heading-${level}` as IconProps["size"]
  return (
    <div className={styles.Wrapper}>
      {svg && <Icon size={size} className={styles.Icon} svg={svg} />}
      <Heading level={level}>{label}</Heading>
    </div>
  )
}
