// src/pages/DaySettingsPage/DaySettingsPage.tsx
import { AmsterdamCrossSpinner, OfflineSettingsAlert } from "@/components"
import { useNavigate, useParams } from "react-router"

import DaySettingsForm from "./DaySettingsForm"
import { useDaySettingsForm } from "./useDaySettingsForm"
import {
  Breadcrumb,
  Grid,
  Heading,
  Paragraph,
} from "@amsterdam/design-system-react"
import { DAY_OF_WEEK_MAP } from "@/shared/constants/dayOfWeeks"
import { useOnlineStatus } from "@/hooks"

export default function DaySettingsPage() {
  const { themeId, dayOfWeek, daySettingsId } = useParams()
  const navigate = useNavigate()

  const { form, theme, daySetting, onSubmit, isLoading } = useDaySettingsForm({
    themeId: themeId!,
    dayOfWeek,
    daySettingsId,
    onSuccess: (id) => navigate(`/team-instellingen/${themeId}/${id}`),
  })

  const isOnline = useOnlineStatus()

  if (isLoading) return <AmsterdamCrossSpinner />

  const nameDayOfWeek =
    DAY_OF_WEEK_MAP[Number(daySetting?.week_days?.[0] ?? dayOfWeek)]

  return (
    <Grid paddingVertical="large" gapVertical="large">
      <Grid.Cell span="all" appearance="transparent">
        <Breadcrumb accessibleName="Kruimelpad">
          <Breadcrumb.Link
            href="/team-instellingen"
            onClick={(e) => {
              e.preventDefault()
              navigate("/team-instellingen")
            }}
          >
            Instellingen
          </Breadcrumb.Link>
          <Breadcrumb.Link
            href={`/team-instellingen/${themeId}`}
            onClick={(e) => {
              e.preventDefault()
              navigate(`/team-instellingen/${themeId}`)
            }}
          >
            {theme?.name ?? "Team"}
          </Breadcrumb.Link>
          <Breadcrumb.Link aria-current="location">
            {daySettingsId ? "Wijzig daginstelling" : "Nieuwe daginstelling"}
          </Breadcrumb.Link>
        </Breadcrumb>
        <Heading level={1}>
          {daySettingsId ? "Wijzig daginstelling" : "Nieuwe daginstelling"}
        </Heading>
        <Paragraph size="large">
          {`${theme?.name} - ${nameDayOfWeek ?? "?"}`}
        </Paragraph>
        {!isOnline && <OfflineSettingsAlert className="ams-mt-l" />}
      </Grid.Cell>
      <Grid.Cell span="all">
        <DaySettingsForm
          form={form}
          themeName={theme?.name}
          themeId={themeId!}
          dayOfWeek={daySetting?.week_days?.[0] ?? dayOfWeek}
          caseCount={daySetting?.case_count?.count}
          onSubmit={onSubmit}
          onCancel={() => navigate(`/team-instellingen/${themeId}`)}
        />
      </Grid.Cell>
    </Grid>
  )
}
