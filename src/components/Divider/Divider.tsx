import styles from "./Divider.module.css"

type DividerProps = {
  className?: string
  margin?: "medium" | "large"
  noMarginBottom?: boolean
}

export function Divider({
  className,
  margin = "large",
  noMarginBottom = false,
}: DividerProps) {
  const sizeClass = margin === "medium" ? styles.Medium : styles.Large
  const noMarginClass = noMarginBottom ? styles.NoMarginBottom : ""

  return (
    <div
      className={`${styles.Divider} ${sizeClass} ${noMarginClass} ${className ?? ""}`}
    />
  )
}
