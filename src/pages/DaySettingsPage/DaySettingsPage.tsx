// src/pages/DaySettingsPage/DaySettingsPage.tsx
import { PageHeading, AmsterdamCrossSpinner } from "@/components"
import { SettingsIcon } from "@amsterdam/design-system-react-icons"
import { useNavigate, useParams } from "react-router"

import DaySettingsForm from "./DaySettingsForm"
import { useDaySettingsForm } from "./useDaySettingsForm"

export default function DaySettingsPage() {
  const { themeId, dayOfWeek, daySettingsId } = useParams()
  const navigate = useNavigate()

  const { form, theme, daySetting, onSubmit, isLoading } = useDaySettingsForm({
    themeId: themeId!,
    dayOfWeek,
    daySettingsId,
    onSuccess: (id) => navigate(`/team-settings/${themeId}/${id}`),
  })

  if (isLoading) return <AmsterdamCrossSpinner />

  return (
    <>
      <PageHeading
        icon={SettingsIcon}
        label={daySettingsId ? "Wijzig daginstelling" : "Nieuwe daginstelling"}
        backLinkLabel="Terug"
        backLinkUrl={`/team-settings/${themeId}`}
      />
      <DaySettingsForm
        form={form}
        themeName={theme?.name}
        themeId={themeId!}
        dayOfWeek={daySetting?.week_days?.[0] ?? dayOfWeek}
        caseCount={daySetting?.case_count?.count}
        onSubmit={onSubmit}
        onCancel={() => navigate(`/team-settings/${themeId}`)}
      />
    </>
  )
}
