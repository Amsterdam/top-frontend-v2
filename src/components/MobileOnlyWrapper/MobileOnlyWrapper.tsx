import styles from "./MobileOnlyWrapper.module.css"

type MobileOnlyWrapperProps = {
  children: React.ReactNode
}

export const MobileOnlyWrapper = ({ children }: MobileOnlyWrapperProps) => (
  <span className={styles.wrapper}>{children}</span>
)
