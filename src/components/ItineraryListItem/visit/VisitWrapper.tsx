import {
  Column,
  Icon,
  Paragraph,
  Row,
  type IconProps,
} from "@amsterdam/design-system-react"
import dayjs from "dayjs"
import {
  CheckMarkIcon,
  ClockFillIcon,
} from "@amsterdam/design-system-react-icons"
import { VisitState } from "./visit.types"
import { ItineraryListItemVariant } from "../ItineraryListItem.variant"
import styles from "./VisitWrapper.module.css"
import { getMostRecentVisit, getVisitState } from "./visit.selectors"

type Props = {
  item: ItineraryItem
  children: React.ReactNode
  variant?: ItineraryListItemVariant
}

const visitStateConfig: Record<
  Exclude<VisitState, typeof VisitState.Pending>,
  {
    className: string
    icon: IconProps["svg"]
    label: string
  }
> = {
  [VisitState.InProgress]: {
    className: styles.InProgress,
    icon: ClockFillIcon,
    label: "Nog afronden",
  },
  [VisitState.Completed]: {
    className: styles.Completed,
    icon: CheckMarkIcon,
    label: "Afgerond",
  },
}

export function VisitWrapper({ children, variant, item }: Props) {
  const visitState = getVisitState(item)
  const mostRecentVisit = getMostRecentVisit(item)

  if (
    variant !== ItineraryListItemVariant.Default ||
    visitState === VisitState.Pending
  ) {
    return (
      <Column
        className={`${styles.Card} ${styles.ContentCardDefault}`}
        gap="small"
      >
        {children}
      </Column>
    )
  }

  if (
    visitState === VisitState.InProgress ||
    visitState === VisitState.Completed
  ) {
    const state = visitStateConfig[visitState]
    const startTime = mostRecentVisit?.start_time
      ? dayjs(mostRecentVisit.start_time).format("HH:mm")
      : undefined

    return (
      <Column
        className={`${styles.Card} ${styles.StateCard} ${state.className}`}
        gap="small"
      >
        <Row alignVertical="center" gap="small" className={styles.StateRow}>
          <Icon
            svg={state.icon}
            className={styles.StateIcon}
            size="heading-2"
          />
          <Paragraph>
            <strong>
              {state.label}
              {startTime && <> - {startTime}</>}
            </strong>
          </Paragraph>
        </Row>

        <Column className={styles.ContentedCard} gap="small">
          {children}
        </Column>
      </Column>
    )
  }
}
