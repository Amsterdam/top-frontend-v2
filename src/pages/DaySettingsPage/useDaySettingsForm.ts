// src/pages/DaySettingsPage/useDaySettingsForm.ts
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import dayjs from "dayjs"
import { useDaySetting, useTheme } from "@/api/hooks"
import { useAlert } from "@/components/alerts/useAlert"
import {
  hasPostalCodeOverlap,
  ALLOWED_POSTAL_CODE_RANGES,
} from "./form/postalCodeRangeValidation"
import type { FormValues } from "./types"

type Options = {
  themeId: string
  dayOfWeek?: string
  daySettingsId?: string
  onSuccess?: (id: number) => void
}

export function useDaySettingsForm({
  themeId,
  dayOfWeek,
  daySettingsId,
  onSuccess,
}: Options) {
  const [theme] = useTheme(themeId)
  const [daySetting, { execPut, execPost, isBusy }] =
    useDaySetting(daySettingsId)
  const [isLoading, setIsLoading] = useState(false)
  const { showAlert } = useAlert()

  const form = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      team_settings: themeId,
      opening_date: dayjs().format("YYYY-MM-DD"),
      postal_code_ranges: ALLOWED_POSTAL_CODE_RANGES,
      postal_codes_type: "stadsdeel",
      week_days: dayOfWeek ? [dayOfWeek] : [],
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

  // If editing, populate form with existing data
  useEffect(() => {
    if (!daySetting) return

    const toStringArray = (arr?: number[] | null) => (arr ?? []).map(String)
    const hasDistricts = daySetting.districts && daySetting.districts.length > 0
    const isHousingCorporationTheme = daySetting.team_settings?.id === 5

    form.reset({
      opening_date: daySetting.opening_date
        ? dayjs(daySetting.opening_date).format("YYYY-MM-DD")
        : undefined,
      postal_codes_type: hasDistricts ? "stadsdeel" : "postcode",
      ...(hasDistricts
        ? { districts: toStringArray(daySetting.districts) }
        : {
            postal_code_ranges:
              daySetting.postal_code_ranges ?? ALLOWED_POSTAL_CODE_RANGES,
          }),
      week_days: daySetting.week_days ? [String(daySetting.week_days[0])] : [],
      name: daySetting.name ?? "",
      reasons: toStringArray(daySetting.reasons),
      project_ids: toStringArray(daySetting.project_ids),
      subjects: toStringArray(daySetting.subjects),
      tags: toStringArray(daySetting.tags),
      state_types: toStringArray(daySetting.state_types),
      day_segments: toStringArray(daySetting.day_segments),
      week_segments: toStringArray(daySetting.week_segments),
      priorities: toStringArray(daySetting.priorities),
      ...(isHousingCorporationTheme && {
        housing_corporations: toStringArray(
          daySetting.housing_corporations ?? [],
        ),
        housing_corporation_combiteam:
          daySetting.housing_corporation_combiteam === true
            ? "true"
            : daySetting.housing_corporation_combiteam === false
              ? "false"
              : "",
      }),
    })
  }, [daySetting, form])

  const onSubmit = async (values: FormValues) => {
    if (hasPostalCodeOverlap(values.postal_code_ranges)) return

    setIsLoading(true)
    const payload = { ...values } as unknown as DaySettingsPayload
    if (values.housing_corporation_combiteam === "true") {
      payload.housing_corporation_combiteam = true
    } else if (values.housing_corporation_combiteam === "false") {
      payload.housing_corporation_combiteam = false
    } else {
      delete payload.housing_corporation_combiteam
    }
    if (values.postal_codes_type === "stadsdeel") {
      payload.postal_code_ranges = []
    } else {
      payload.districts = []
    }

    const exec = daySettingsId ? execPut : execPost
    exec(payload, { clearCacheKeys: ["/team-settings"] })
      .then((res) => {
        if (res?.id) {
          showAlert({
            title: "Daginstelling opgeslagen!",
            description: `De daginstelling is succesvol ${daySettingsId ? "bijgewerkt" : "aangemaakt"}.`,
            severity: "success",
          })
          onSuccess?.(res.id)
        }
      })
      .finally(() => {
        setTimeout(() => setIsLoading(false), 350)
      })
  }

  return {
    form,
    theme,
    daySetting,
    onSubmit,
    isLoading: isLoading || isBusy,
  }
}
