import { Heading, Icon, type IconProps } from "@amsterdam/design-system-react"
import styles from "./PageHeading.module.css"
import clsx from "clsx"
import { StandaloneLink } from "@amsterdam/design-system-react"
import { ChevronBackwardIcon } from "@amsterdam/design-system-react-icons"
import { useNavigate, type To } from "react-router"

type Props = {
  label: string
  level?: 1 | 2 | 3 | 4 | 5 | 6
  icon?: IconProps["svg"]
  border?: boolean
  backLinkUrl?: string
  backLinkLabel?: string
  backLinkState?: unknown
}

type Size =
  | "level-1"
  | "level-2"
  | "level-3"
  | "level-4"
  | "level-5"
  | "level-6"

export const PageHeading: React.FC<Props> = ({
  label,
  level = 1,
  icon,
  border = false,
  backLinkUrl,
  backLinkLabel,
  backLinkState,
}) => {
  const size: Size = `level-${level}`
  const navigate = useNavigate()

  return (
    <div className={clsx(styles.wrapper, border && styles.withBorder)}>
      {backLinkLabel && (
        <div className={styles.backLink}>
          <StandaloneLink
            href={backLinkUrl ?? ""}
            onClick={(e) => {
              e.preventDefault()
              if (backLinkState && backLinkUrl) {
                // backLinkUrl is required when passing state. -1 is not passing the state.
                navigate(backLinkUrl, {
                  state: backLinkState,
                })
              } else {
                navigate(backLinkUrl ?? (-1 as To))
              }
            }}
            icon={ChevronBackwardIcon}
          >
            {backLinkLabel}
          </StandaloneLink>
        </div>
      )}
      <div style={{ display: "flex" }}>
        {icon && (
          <Icon size={`heading-${level}`} className={styles.icon} svg={icon} />
        )}
        <Heading size={size} level={1}>
          {label}
        </Heading>
      </div>
    </div>
  )
}

export default PageHeading
