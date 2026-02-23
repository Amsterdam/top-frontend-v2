import {
  Button,
  Grid,
  Heading,
  Paragraph,
  Row,
} from "@amsterdam/design-system-react"
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
}

export function WeekDaySettings({
  dayOfWeekId,
  dayOfWeekName,
  daySettings,
  teamSettingsOptions,
}: Props) {
  const navigate = useNavigate()
  return (
    <>
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
        <Grid paddingBottom="x-large">
          {daySettings.map((daySetting) => (
            <Grid.Cell key={daySetting.id} span="all">
              <DaySettingsCard
                daySetting={daySetting}
                teamSettingsOptions={teamSettingsOptions}
              />
            </Grid.Cell>
          ))}
        </Grid>
      )}
    </>
  )
}
