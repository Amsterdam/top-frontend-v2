import styles from "./AmsterdamCrossSpinner.module.css"

interface OverlaySpinnerProps {
  loading: boolean
  children: React.ReactNode
}

export function AmsterdamCrossSpinnerOverlay({
  loading,
  children,
}: OverlaySpinnerProps) {
  return (
    <div className={styles.container}>
      {children}
      {loading && (
        <div className={styles.overlay}>
          <div className={styles.svgContainer}>
            {[0, 1, 2].map((index) => (
              <svg
                key={index}
                className={styles.cross}
                style={{ animationDelay: `${index * 0.75}s` }}
                width="187"
                height="187"
                viewBox="0 0 187 187"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0 149.03L55.885 93.142L0 37.253L37.252 0L93.142 55.886L149.027 0L186.284 37.253L130.393 93.142L186.284 149.03L149.027 186.284L93.142 130.397L37.263 186.284L0 149.03Z" />
              </svg>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default AmsterdamCrossSpinnerOverlay
