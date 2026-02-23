import { ActionGroup, IconButton } from "@amsterdam/design-system-react"
import { useNavigate } from "react-router"
import { PencilIcon, SettingsIcon } from "@amsterdam/design-system-react-icons"
import { Card, HeadingWithIcon } from "@/components"
import type { TeamSettingsOptions } from "../types"
import DaySettingsContent from "./DaySettingsContent/DaySettingsContent"
import { DeleteDaySettingsButton } from "./DeleteDaySettingsButton/DeleteDaySettingsButton"

type Props = {
  daySetting: DaySettings
  teamSettingsOptions: TeamSettingsOptions
}

export default function DaySettingsCard({
  daySetting,
  teamSettingsOptions,
}: Props) {
  const navigate = useNavigate()
  return (
    <Card
      title={
        <HeadingWithIcon
          label={daySetting.name}
          svg={SettingsIcon}
          highlightIcon
        />
      }
      actions={
        <ActionGroup>
          <IconButton
            svg={PencilIcon}
            label="Wijzigen"
            title="Wijzigen"
            size="heading-3"
            onClick={(e) => {
              e.stopPropagation()
              navigate(`${daySetting.id}`)
            }}
          >
            Wijzigen
          </IconButton>
          <DeleteDaySettingsButton
            daySettingId={daySetting.id}
            daySettingName={daySetting.name}
          />
        </ActionGroup>
      }
      className="animate-scale-in-center"
      collapsible
      defaultOpen={true}
    >
      <DaySettingsContent
        daySetting={daySetting}
        teamSettingsOptions={teamSettingsOptions}
      />
    </Card>
  )
}
