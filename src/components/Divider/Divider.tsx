import styles from "./Divider.module.css"

type DividerProps = {
  className?: string
  margin?: "medium" | "large"
}

export function Divider({ className, margin = "large" }: DividerProps) {
  const sizeClass = margin === "medium" ? styles.Medium : styles.Large
  return <div className={`${styles.Divider} ${sizeClass} ${className ?? ""}`} />
}
