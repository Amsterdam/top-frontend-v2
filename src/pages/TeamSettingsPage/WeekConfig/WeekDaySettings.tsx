import { Button, Heading, Paragraph, Row } from "@amsterdam/design-system-react"
import { PlusIcon } from "@amsterdam/design-system-react-icons"
import { useNavigate } from "react-router"
import { Divider, Tag } from "@/components"
import DaySettingsCard from "../DaySettingsCard/DaySettingsCard"
import type { TeamSettingsOptions } from "../types"

type Props = {
  dayOfWeekId: number
  dayOfWeekName: string
  daySettings: DaySettings[]
  teamSettingsOptions: TeamSettingsOptions
  animationDelay?: number
}

export function WeekDaySettings({
  dayOfWeekId,
  dayOfWeekName,
  daySettings,
  teamSettingsOptions,
  animationDelay = 0,
}: Props) {
  const navigate = useNavigate()
  return (
    <div
      className="animate-slide-in-bottom mb-6"
      style={{ animationDelay: `${animationDelay}s` }}
    >
      <Row align="between" alignVertical="end" wrap className="mt-4">
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Heading level={2}>{dayOfWeekName}</Heading>
          <Tag
            name={`${daySettings?.length ?? 0} actieve instelling${daySettings?.length === 1 ? "" : "en"}`}
            color="azure"
          />
        </div>
        <Button
          icon={PlusIcon}
          iconBefore
          onClick={() => navigate(`nieuw/${dayOfWeekId}`)}
        >
          Nieuwe instelling
        </Button>
      </Row>
      <Divider />
      {daySettings.length === 0 ? (
        <Paragraph>Er zijn nog geen instellingen voor deze dag.</Paragraph>
      ) : (
        daySettings.map((daySetting, index) => (
          <DaySettingsCard
            key={daySetting.id}
            daySetting={daySetting}
            teamSettingsOptions={teamSettingsOptions}
            animationDelay={index * 0.2}
          />
        ))
      )}
    </div>
  )
}
