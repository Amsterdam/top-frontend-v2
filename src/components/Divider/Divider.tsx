import styles from "./Divider.module.css"

type DividerProps = {
  className?: string
}

export function Divider({ className }: DividerProps) {
  return <div className={`${styles.divider} ${className ?? ""}`} />
}
