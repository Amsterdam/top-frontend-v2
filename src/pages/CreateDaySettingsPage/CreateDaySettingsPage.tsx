import { useState } from "react"
import { SettingsIcon } from "@amsterdam/design-system-react-icons"
import { useNavigate, useParams } from "react-router"
import { useForm } from "react-hook-form"
import dayjs from "dayjs"

import { useDaySetting, useDaySettingCasesCount, useTheme } from "@/api/hooks"
import { AmsterdamCrossSpinner, PageHeading } from "@/components"
import {
  ALLOWED_POSTAL_CODE_RANGES,
  hasPostalCodeOverlap,
} from "./form/postalCodeRangeValidation"
import CreateDaySettingsForm from "./CreateDaySettingsForm"
import type { FormValues } from "./types"

export default function CreateDaySettingsPage() {
  const { themeId, dayOfWeek } = useParams<{
    themeId: string
    dayOfWeek: string
  }>()
  const navigate = useNavigate()
  const [theme] = useTheme(themeId!)
  const [daySettingsId, setDaySettingsId] = useState<number | undefined>(
    undefined,
  )
  const [, { execPost }] = useDaySetting(undefined, { lazy: true })
  const [daySetting] = useDaySettingCasesCount(daySettingsId) // Get number of available cases for this daysetting.
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      team_settings: themeId,
      opening_date: dayjs().format("YYYY-MM-DD"),
      postal_code_ranges: ALLOWED_POSTAL_CODE_RANGES,
      postal_codes_type: "stadsdeel",
      week_days: [dayOfWeek],
      name: "",
      reasons: [],
      project_ids: [],
      subjects: [],
      tags: [],
      state_types: [],
      day_segments: [],
      week_segments: [],
      priorities: [],
      districts: [],
    },
  })

  const onSubmit = async (values: FormValues) => {
    console.log("Form values to submit:", values)
    if (hasPostalCodeOverlap(values.postal_code_ranges)) {
      return
    }
    setIsLoading(true)
    const payload = {
      ...values,
    } as DaySettingsPayload
    /*
     ** Now the default option in the back-end for combiteam is false. It does not matter if we send false or omit the field.
     ** This should be changed because Onderhuur wants to add the third option "Alle opties" which should not be interpreted as false. Until then, we will omit the field when the value is "".
     */
    if (
      values.housing_corporation_combiteam === "" ||
      values.housing_corporation_combiteam === undefined
    ) {
      delete payload.housing_corporation_combiteam
    }
    console.log("Payload before cleanup:", payload)

    execPost(payload, {})
      .then((response) => {
        console.log("API response:", response)
        setDaySettingsId(response?.id)

        // navigate(`/lijst/${response?.id}`)
      })
      .finally(() => {
        // Add slight delay to improve UX by preventing flicker. Navigation takes more time.
        setTimeout(() => {
          setIsLoading(false)
        }, 350)
      })
  }

  if (isLoading) return <AmsterdamCrossSpinner />
  return (
    <>
      <PageHeading
        icon={SettingsIcon}
        label="Nieuwe daginstelling"
        backLinkLabel="Terug"
      />
      <CreateDaySettingsForm
        form={form}
        themeName={theme?.name}
        themeId={themeId!}
        dayOfWeek={dayOfWeek}
        caseCount={daySetting?.case_count?.count}
        onSubmit={onSubmit}
        onCancel={() => navigate(`/team-settings/${themeId}`)}
      />
    </>
  )
}
