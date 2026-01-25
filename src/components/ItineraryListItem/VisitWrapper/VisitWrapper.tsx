import { Column, Icon, Paragraph, Row } from "@amsterdam/design-system-react"
import styles from "./VisitWrapper.module.css"
import {
  CheckMarkIcon,
  ClockFillIcon,
} from "@amsterdam/design-system-react-icons"

const visitStateConfig = {
  visitInProgress: {
    className: styles.InProgress,
    icon: ClockFillIcon,
    label: "Bezocht, maar nog niet afgerond",
  },
  visitCompleted: {
    className: styles.Completed,
    icon: CheckMarkIcon,
    label: "Bezoek succesvol afgerond",
  },
} as const

type Props = {
  children: React.ReactNode
  type?: "default" | "addStartAddress" | "addSuggestedCase"
  visitState?: "pendingVisit" | "visitInProgress" | "visitCompleted"
}

export function VisitWrapper({ children, type, visitState }: Props) {
  if (type !== "default" || visitState === "pendingVisit") {
    return (
      <Column
        className={`${styles.Card} ${styles.ContentCardDefault}`}
        gap="small"
      >
        {children}
      </Column>
    )
  }

  if (visitState === "visitInProgress" || visitState === "visitCompleted") {
    const state = visitStateConfig[visitState]

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
            <strong>{state.label}</strong>
          </Paragraph>
        </Row>

        <Column className={styles.ContentedCard} gap="small">
          {children}
        </Column>
      </Column>
    )
  }

  return <>{children}</>
}
