// src/pages/DaySettingsPage/DaySettingsPage.tsx
import { AmsterdamCrossSpinner } from "@/components"
import { useNavigate, useParams } from "react-router"

import DaySettingsForm from "./DaySettingsForm"
import { useDaySettingsForm } from "./useDaySettingsForm"
import { Breadcrumb, Heading } from "@amsterdam/design-system-react"

export default function DaySettingsPage() {
  const { themeId, dayOfWeek, daySettingsId } = useParams()
  const navigate = useNavigate()

  const { form, theme, daySetting, onSubmit, isLoading } = useDaySettingsForm({
    themeId: themeId!,
    dayOfWeek,
    daySettingsId,
    onSuccess: (id) => navigate(`/team-instellingen/${themeId}/${id}`),
  })

  if (isLoading) return <AmsterdamCrossSpinner />

  return (
    <>
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
      <DaySettingsForm
        form={form}
        themeName={theme?.name}
        themeId={themeId!}
        dayOfWeek={daySetting?.week_days?.[0] ?? dayOfWeek}
        caseCount={daySetting?.case_count?.count}
        onSubmit={onSubmit}
        onCancel={() => navigate(`/team-instellingen/${themeId}`)}
      />
    </>
  )
}
