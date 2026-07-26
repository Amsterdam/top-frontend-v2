import { Button, Heading, Paragraph, Row } from "@amsterdam/design-system-react"
import { PlusIcon } from "@amsterdam/design-system-react-icons"
import { useNavigate } from "react-router"
import DaySettingsCard from "../DaySettingsCard/DaySettingsCard"
import type { TeamSettingsOptions } from "../types"
import styles from "./WeekDaySettings.module.css"

type Props = {
  dayOfWeekId: number
  dayOfWeekName: string
  daySettings: DaySettings[]
  teamSettingsOptions: TeamSettingsOptions
  teamId: string
}

export function WeekDaySettings({
  dayOfWeekId,
  dayOfWeekName,
  daySettings,
  teamSettingsOptions,
  teamId,
}: Props) {
  const navigate = useNavigate()
  return (
    <>
      <div className={styles.dayHeader}>
        <Row alignVertical="center" align="between" wrap>
          <Heading level={2}>{dayOfWeekName}</Heading>
          <Button
            icon={PlusIcon}
            iconBefore
            onClick={() => navigate(`nieuw/${dayOfWeekId}`)}
          >
            Nieuwe instelling
          </Button>
        </Row>
      </div>
      {daySettings.length === 0 ? (
        <Paragraph>Er zijn nog geen instellingen voor deze dag.</Paragraph>
      ) : (
        daySettings.map((daySetting, index) => (
          <DaySettingsCard
            key={daySetting.id}
            daySetting={daySetting}
            teamSettingsOptions={teamSettingsOptions}
            teamId={teamId}
            animationDelay={index * 0.2}
          />
        ))
      )}
    </>
  )
}
