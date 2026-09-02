import { useCallback, useMemo, useState } from "react"
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
  ErrorIcon,
} from "@amsterdam/design-system-react-icons"
import { VisitState } from "./visit.types"
import { ItineraryListItemVariant } from "../ItineraryListItem.variant"
import styles from "./VisitWrapper.module.css"
import { getMostRecentVisit, getVisitState } from "./visit.selectors"
import {
  VisitWrapperNotificationContext,
  type VisitWrapperNotification,
  type VisitWrapperNotificationTone,
} from "./visit-notification"

type Props = {
  item: ItineraryItem
  children: React.ReactNode
  variant?: ItineraryListItemVariant
}

type VisitStateConfig = {
  className: string
  icon?: IconProps["svg"]
  label?: string
  showHeader: boolean
}

type NotificationToneConfig = {
  className: string
  icon: IconProps["svg"]
}

const visitStateConfig: Record<VisitState, VisitStateConfig> = {
  [VisitState.Pending]: {
    className: styles.Pending,
    showHeader: false,
  },
  [VisitState.InProgress]: {
    className: styles.InProgress,
    icon: ClockFillIcon,
    label: "Nog afronden",
    showHeader: true,
  },
  [VisitState.Completed]: {
    className: styles.Completed,
    icon: CheckMarkIcon,
    label: "Afgerond",
    showHeader: true,
  },
}

const notificationToneConfig: Record<
  VisitWrapperNotificationTone,
  NotificationToneConfig
> = {
  success: {
    className: styles.NotificationSuccess,
    icon: CheckMarkIcon,
  },
  error: {
    className: styles.NotificationError,
    icon: ErrorIcon,
  },
  info: {
    className: styles.NotificationInfo,
    icon: ClockFillIcon,
  },
}

export function VisitWrapper({ children, variant, item }: Props) {
  const visitState = getVisitState(item)
  const mostRecentVisit = getMostRecentVisit(item)
  const [notification, setNotification] =
    useState<VisitWrapperNotification | null>(null)

  const pushNotification = useCallback(
    (nextNotification: VisitWrapperNotification) => {
      setNotification(nextNotification)
    },
    [],
  )

  const clearNotification = useCallback(() => {
    setNotification(null)
  }, [])

  const notificationApi = useMemo(
    () => ({ pushNotification, clearNotification }),
    [pushNotification, clearNotification],
  )

  const state = visitStateConfig[visitState]
  const isDefaultVariant = variant === ItineraryListItemVariant.Default
  const startTime = mostRecentVisit?.start_time
    ? dayjs(mostRecentVisit.start_time).format("HH:mm")
    : undefined

  const notificationStyle = notification
    ? notificationToneConfig[notification.tone]
    : null
  const cardStatusClassName = notificationStyle
    ? `${styles.NotificationCard} ${notificationStyle.className}`
    : isDefaultVariant
      ? `${styles.StateCard} ${state.className}`
      : ""

  return (
    <VisitWrapperNotificationContext.Provider value={notificationApi}>
      <Column className={`${styles.Card} ${cardStatusClassName}`} gap="none">
        {!notification &&
          isDefaultVariant &&
          state.showHeader &&
          state.icon &&
          state.label && (
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
          )}

        {notification && notificationStyle && (
          <Row
            role="status"
            alignVertical="center"
            gap="small"
            className={`${styles.NotificationRow} ${notificationStyle.className}`}
          >
            <Icon
              svg={notification.icon ?? notificationStyle.icon}
              className={styles.NotificationIcon}
              size="heading-2"
            />
            <Paragraph>
              <strong>{notification.label}</strong>
            </Paragraph>
          </Row>
        )}

        <Column className={styles.ContentCard} gap="small">
          {children}
        </Column>
      </Column>
    </VisitWrapperNotificationContext.Provider>
  )
}
